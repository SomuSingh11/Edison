import { db } from "@/config/db";
import { QuizzesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function PUT(req) {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quizId, userAnswers } = await req.json();

    if (!quizId || !userAnswers) {
      return NextResponse.json(
        { error: "Missing quizId or userAnswers" },
        { status: 400 }
      );
    }

    // First, fetch the quiz to get questions for score calculation
    const existingQuiz = await db
      .select()
      .from(QuizzesTable)
      .where(
        and(
          eq(QuizzesTable.quizId, quizId),
          eq(QuizzesTable.userEmail, userEmail) // Security: ensure user owns this quiz
        )
      )
      .limit(1);

    if (existingQuiz.length === 0) {
      return NextResponse.json(
        { error: "Quiz not found or unauthorized" },
        { status: 404 }
      );
    }

    const quiz = existingQuiz[0];
    const questions = quiz.questions;

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Update the quiz with user answers and score
    const result = await db
      .update(QuizzesTable)
      .set({
        userAnswers,
        score,
      })
      .where(eq(QuizzesTable.quizId, quizId))
      .returning();

    return NextResponse.json({
      success: true,
      quiz: result[0],
      score,
      correctCount,
      totalQuestions,
    });
  } catch (error) {
    console.error("Error updating quiz answers:", error);
    return NextResponse.json(
      { error: "Failed to update quiz answers" },
      { status: 500 }
    );
  }
}
