import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Fetches a single, published course document by its 'courseId' (cid).
 * This route is public and does not require authentication.
 */
export async function GET(req) {
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Simplified query: No user check, no enrollment join.
    const result = await db
      .select()
      .from(coursesTable)
      .where(
        and(
          eq(coursesTable.cid, courseId),
          sql`jsonb_array_length(${coursesTable.courseContent}::jsonb) > 0`
        )
      );

    // Handle if course is not found or not published
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Course not found or it has not been published yet." },
        { status: 404 }
      );
    }

    // Return the single course object
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("[GET_COURSE_BY_ID_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
