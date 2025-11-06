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
- **Prioritize** answering the question based directly on the provided CHAPTER CONTENT.
- If helpful for clarification or providing deeper context, you **may** include **brief supplementary information** from your general knowledge about the topic.
- **Clearly indicate** any supplementary information (e.g., start with "For extra context:" or "Beyond the chapter material:").
- Write in a clear, conversational style, like explaining to a friend.
- Use simple HTML formatting: <p> for paragraphs, <strong> for important points, <ul> and <li> for lists.
- Use <code> for inline code and <pre><code> for code blocks if relevant.
- If the student's question is completely unrelated to the chapter content, politely state that you can only answer questions about the provided material.
- Be concise but thorough in your explanation.

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
