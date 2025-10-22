import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { question, chapterContext } = await req.json();

    if (!question || !chapterContext) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `You are Fenny, an AI learning assistant. Answer the student's question based on the chapter content provided below.

CHAPTER CONTENT:
${JSON.stringify(chapterContext, null, 2)}

STUDENT'S QUESTION: 
${question}

INSTRUCTIONS:
- Answer based ONLY on the chapter content above
- Write in a clear, conversational style as if explaining to a friend
- Use simple HTML formatting: <p> for paragraphs, <strong> for important points, <ul> and <li> for lists
- DO NOT use code blocks, syntax highlighting, or technical formatting
- Keep it simple and easy to copy into notes
- If the question is unrelated to the chapter, politely say so
- Be concise but thorough

Write your answer as if it's going directly into the student's study notes.`;

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

    // Generate content (non-streaming with this package)
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    const responseText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Simulate streaming by chunking the response
    const readableStream = new ReadableStream({
      start(controller) {
        try {
          // Send the entire response at once or chunk it
          const words = responseText.split(" ");
          let index = 0;

          const sendChunk = () => {
            if (index < words.length) {
              const chunk = words[index] + " ";
              controller.enqueue(new TextEncoder().encode(chunk));
              index++;
              setTimeout(sendChunk, 20); // Small delay for streaming effect
            } else {
              controller.close();
            }
          };

          sendChunk();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Fenny AI Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
