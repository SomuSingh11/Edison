import { db } from "@/config/db";
import { QuizzesTable } from "@/config/schema"; // Ensure this matches your schema file export
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const user = await currentUser();
    // 1. Authenticate the user
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;

    // 2. Get query parameters
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const chapterIndexParam = searchParams.get("chapterIndex"); // Get as string first

    // 3. Validate parameters
    if (!courseId || chapterIndexParam === null) {
      return NextResponse.json(
        { error: "Missing required parameters: courseId and chapterIndex" },
        { status: 400 }
      );
    }

    // Convert chapterIndex to a number
    const chapterIndex = parseInt(chapterIndexParam, 10);
    if (isNaN(chapterIndex)) {
      return NextResponse.json(
        { error: "Invalid chapterIndex format" },
        { status: 400 }
      );
    }

    // 4. Query the database
    const quizzes = await db
      .select()
      .from(QuizzesTable)
      .where(
        and(
          eq(QuizzesTable.userEmail, userEmail),
          eq(QuizzesTable.courseId, courseId),
          eq(QuizzesTable.chapterIndex, chapterIndex)
        )
      )
      .orderBy(desc(QuizzesTable.createdAt)); // Order by creation date, newest first

    // 5. Return the results
    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("[GET_QUIZ_HISTORY_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
