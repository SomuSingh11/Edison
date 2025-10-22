import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { QuizzesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chapterContent, courseId, courseName, chapterIndex, chapterName } =
      await req.json();

    if (!chapterContent || !courseId || chapterIndex === undefined) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: chapterContent, courseId, chapterIndex",
        },
        { status: 400 }
      );
    }

    // Create a prompt to generate MCQs
    const prompt = `You are a quiz generator. Create 10 multiple choice questions (MCQs) based on the following chapter content.

CHAPTER CONTENT:
${JSON.stringify(chapterContent, null, 2)}

REQUIREMENTS:
- Generate exactly 10 multiple choice questions
- Each question should have 4 options
- Questions should test understanding of key concepts from the chapter
- Make questions clear and unambiguous
- Include a mix of difficulty levels (easy, medium, hard)
- Questions should be directly answerable from the chapter content
- Make questions unique and diverse

Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{
  "questions": [
    {
      "question": "What is...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

The correctAnswer should be the index (0-3) of the correct option in the options array.`;

    const model = "gemini-2.5-flash";

    const config = {
      responseMimeType: "text/plain",
    };

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    // Generate content
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const rawResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawResponse) {
      throw new Error("No response from AI");
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = rawResponse
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse JSON
    let quizData;
    try {
      quizData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", cleanedResponse);
      throw new Error("AI response was not valid JSON");
    }

    // Validate the structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error("Invalid quiz data structure");
    }

    // Validate each question
    quizData.questions = quizData.questions.filter((q) => {
      return (
        q.question &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === "number" &&
        q.correctAnswer >= 0 &&
        q.correctAnswer < 4
      );
    });

    if (quizData.questions.length === 0) {
      throw new Error("No valid questions generated");
    }

    // Always create a NEW quiz (allow multiple quizzes per chapter)
    const quizId = uuidv4();
    const timestamp = new Date().toLocaleString();

    const savedQuiz = await db
      .insert(QuizzesTable)
      .values({
        quizId: quizId,
        courseId: courseId,
        courseName: courseName || "",
        chapterIndex: chapterIndex,
        chapterName: chapterName || `Chapter ${chapterIndex + 1}`,
        title: `${
          chapterName || `Chapter ${chapterIndex + 1}`
        } Quiz - ${timestamp}`,
        questions: quizData.questions,
        totalQuestions: quizData.questions.length,
        userEmail: user.primaryEmailAddress?.emailAddress,
      })
      .returning();

    return NextResponse.json({
      success: true,
      questions: quizData.questions,
      quiz: savedQuiz[0],
      message: "Quiz generated and saved successfully",
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate quiz",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
