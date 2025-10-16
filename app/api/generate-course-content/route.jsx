import { NextResponse } from "next/server";
import { ai } from "../generate-course-layout/route";
import axios from "axios";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";

const PROMPT = `
You are an expert instructional designer. Based on the following chapter details, generate detailed educational content for each topic.
The content for each topic MUST be in valid HTML format (e.g., using <p>, <ul>, <li>, <code>, <strong> tags).

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON, nothing else
- Do NOT include markdown code fences like \`\`\`json or \`\`\`
- Do NOT include any explanatory text before or after the JSON
- Do NOT include comments in the JSON
- Ensure all strings are properly escaped
- Do NOT use newlines inside string values (use HTML tags like <br> instead)

The JSON schema you must follow:
{
  "chapterName": "string",
  "topics": [
    {
      "topic": "string",
      "content": "string (HTML content here)"
    }
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

      // Fix unescaped quotes in strings (basic attempt)
      // This is a simple fix and may not catch all cases

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
        responseMimeType: "application/json", // Request JSON format
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
          youtubeVideo: [],
          CourseContent: {
            chapterName: chapter.chapterName,
            topics: [],
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

        // Return a fallback structure
        courseContent.push({
          youtubeVideo: [],
          CourseContent: {
            chapterName: chapter.chapterName,
            topics: chapter.topics.map((topic) => ({
              topic: topic,
              content:
                "<p>Content generation failed. Please try regenerating this chapter.</p>",
            })),
            error: "Failed to generate content due to invalid AI response.",
          },
        });
        continue;
      }

      // Fetch YouTube videos in parallel
      const youtubeData = await GetYoutubeVideo(chapter.chapterName);

      courseContent.push({
        youtubeVideo: youtubeData,
        CourseContent: parsed,
      });

      // Rate limiting: Wait 1.5 seconds between chapters (except for the last one)
      if (i < courseJson.chapters.length - 1) {
        console.log(`Waiting 1.5s before processing next chapter...`);
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }
    }

    // Update database
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
      q: topic,
      maxResults: 4, // Fixed typo: maxResult -> maxResults
      type: "video",
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
    return []; // Return empty array on error
  }
};
