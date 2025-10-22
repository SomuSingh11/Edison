import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";
import axios from "axios";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";

const PROMPT = `
You are an expert instructional designer. Based on the following chapter details, generate detailed educational content.
For each topic in the user input, create a 'header' block for its title, followed by one or more 'paragraph', 'list', or 'code' blocks for its content.
The content for each topic MUST be broken down into individual blocks.

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON, nothing else.
- Do NOT include markdown code fences like \`\`\`json or \`\`\`.
- For every code snippet, you MUST use the "codeBox" type and correctly identify the programming language (e.g., "java", "javascript", "python", "css") in the "language" field.

The JSON schema you must follow is:
{
  "chapterName": "string",
  "blocks": [
    {
      "type": "header",
      "data": { "text": "The Topic Title", "level": 3 }
    },
    {
      "type": "paragraph",
      "data": { "text": "The content for the topic. This can include <b>bold</b> and <i>italic</i> tags." }
    },
    {
      "type": "code",
      "data": { "code": "public class Main {\\n  // your code here\\n}" }
    },
    {
      "type": "codeBox",
      "data": {
        "code": "console.log('Hello, World!');",
        "language": "javascript"
      }
    },
    {
      "type": "latex",
      "data": { "math": "E = mc^2" }
    },
    // ... and so on for all topics.
  ]
}

User Input:
`;

// Enhanced JSON cleaning and parsing
const safeJsonParse = (rawText) => {
  try {
    // Remove markdown code fences
    let cleaned = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    // Remove any text before the first { and after the last }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON object found in response");
    }

    cleaned = cleaned.substring(firstBrace, lastBrace + 1);

    // Try to parse
    try {
      return { data: JSON.parse(cleaned), error: null };
    } catch (parseErr) {
      // Attempt common fixes
      // Fix trailing commas
      let fixed = cleaned.replace(/,\s*([}\]])/g, "$1");

      return { data: JSON.parse(fixed), error: null };
    }
  } catch (err) {
    console.error("JSON parsing failed:", err.message);
    return { data: null, error: err };
  }
};

export async function POST(req) {
  try {
    const { courseJson, courseTitle, courseId } = await req.json();

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing courseId" },
        { status: 400 }
      );
    }

    if (
      !courseJson?.chapters ||
      !Array.isArray(courseJson.chapters) ||
      courseJson.chapters.length === 0
    ) {
      return NextResponse.json(
        { error: "Course data must include a non-empty array of chapters" },
        { status: 400 }
      );
    }

    // Process chapters sequentially with delay to respect rate limits
    const courseContent = [];

    for (let i = 0; i < courseJson.chapters.length; i++) {
      const chapter = courseJson.chapters[i];

      console.log(
        `Processing chapter ${i + 1}/${courseJson.chapters.length}: ${
          chapter.chapterName
        }`
      );

      const config = {
        responseMimeType: "application/json",
        temperature: 0.7,
      };
      const model = "gemini-2.0-flash-exp";

      const contents = [
        {
          role: "user",
          parts: [
            {
              text:
                PROMPT +
                JSON.stringify({
                  chapterName: chapter.chapterName,
                  topics: chapter.topics,
                }),
            },
          ],
        },
      ];

      // Retry logic with exponential backoff
      let response;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          response = await ai.models.generateContent({
            model,
            config,
            contents,
          });
          break;
        } catch (apiError) {
          attempts++;
          console.error(
            `Attempt ${attempts} failed for chapter: ${chapter.chapterName}`,
            apiError.message
          );

          if (attempts >= maxAttempts) {
            console.error(
              `AI API call failed after ${maxAttempts} attempts for chapter:`,
              chapter.chapterName
            );
            throw new Error(
              `AI generation failed for chapter: ${chapter.chapterName}`
            );
          }

          // Exponential backoff: 2s, 4s, 8s
          await new Promise((res) =>
            setTimeout(res, 2000 * Math.pow(2, attempts - 1))
          );
        }
      }

      const raw = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (!raw || raw.trim().length === 0) {
        console.error(
          "Empty response from AI for chapter:",
          chapter.chapterName
        );
        courseContent.push({
          CourseContent: {
            chapterName: chapter.chapterName,
            blocks: [],
            error: "AI returned empty response.",
          },
        });
        continue;
      }

      const { data: parsed, error: parseError } = safeJsonParse(raw);

      if (parseError || !parsed) {
        console.error(
          "Failed to parse AI response for chapter:",
          chapter.chapterName,
          "\nError:",
          parseError?.message,
          "\nRaw (first 500 chars):",
          raw.substring(0, 500)
        );

        courseContent.push({
          CourseContent: {
            chapterName: chapter.chapterName,
            blocks: [],
            error: "Failed to parse AI response.",
          },
        });
        continue;
      }

      // Successfully parsed - fetch YouTube videos
      const youtubeData = await GetYoutubeVideo(chapter.chapterName);
      const youtubeEmbedBlocks = youtubeData.map((video) => ({
        type: "embed",
        data: {
          service: "youtube",
          embed: `https://www.youtube.com/embed/${video.videoId}`,
          caption: video.title,
        },
      }));

      // Prepend the YouTube videos to the AI-generated content blocks
      parsed.blocks = [...youtubeEmbedBlocks, ...(parsed.blocks || [])];

      // Push the new unified structure ready for Editor.js
      courseContent.push({ CourseContent: parsed });

      // Rate limiting: Wait 1.1s between chapters (except for the last one)
      if (i < courseJson.chapters.length - 1) {
        console.log(`Waiting 1.1s before processing next chapter...`);
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }
    }

    // Update database AFTER processing all chapters
    await db
      .update(coursesTable)
      .set({ courseContent })
      .where(eq(coursesTable.cid, courseId));

    return NextResponse.json({
      courseName: courseTitle,
      courseContent,
      success: true,
    });
  } catch (err) {
    console.error("Error in generate-course-content POST:", err);
    return NextResponse.json(
      { error: err.message || "An internal server error occurred." },
      { status: 500 }
    );
  }
}

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const GetYoutubeVideo = async (topic) => {
  try {
    const params = {
      part: "snippet",
      q: `${topic} tutorial`,
      maxResults: 1,
      type: "video",
      regionCode: "US",
      relevanceLanguage: "en",
      key: process.env.YOUTUBE_API_KEY,
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    const youtubeVideoListResp = resp.data.items || [];

    const youtubeVideoList = youtubeVideoListResp.map((item) => ({
      videoId: item.id?.videoId,
      title: item?.snippet?.title,
    }));

    console.log(`Found ${youtubeVideoList.length} videos for topic: ${topic}`);
    return youtubeVideoList;
  } catch (error) {
    console.error("Error fetching YouTube videos:", error.message);
    return [];
  }
};
