import { db } from "@/config/db";
import { coursesTable, enrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Handles enrolling a user in a course.
 */
export async function POST(req) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if the course exists before enrolling
    const courseExists = await db
      .select({ cid: coursesTable.cid })
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId));
    if (courseExists.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const alreadyEnrolled = await db
      .select()
      .from(enrollCourseTable)
      .where(
        and(
          eq(enrollCourseTable.userEmail, userEmail),
          eq(enrollCourseTable.cid, courseId)
        )
      );

    if (alreadyEnrolled.length > 0) {
      return NextResponse.json(
        { message: "Already Enrolled" },
        { status: 200 }
      );
    }

    const result = await db
      .insert(enrollCourseTable)
      .values({ cid: courseId, userEmail })
      .returning({ id: enrollCourseTable.id });

    return NextResponse.json(
      { message: "Enrolled Successfully", data: result[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ENROLL_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Fetches courses a user is enrolled in.
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

    // Improvement 2: Cleaned up logic and removed redundant code
    if (courseId) {
      // Fetches a single enrolled course
      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(
          enrollCourseTable,
          eq(coursesTable.cid, enrollCourseTable.cid)
        )
        .where(
          and(
            eq(enrollCourseTable.userEmail, userEmail),
            eq(enrollCourseTable.cid, courseId)
          )
        );

      if (result.length === 0) {
        return NextResponse.json(
          { error: "Enrollment not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(result[0]);
    } else {
      // Fetches all enrolled courses
      const result = await db
        .select()
        .from(coursesTable)
        .innerJoin(
          enrollCourseTable,
          eq(coursesTable.cid, enrollCourseTable.cid)
        )
        .where(eq(enrollCourseTable.userEmail, userEmail))
        .orderBy(desc(enrollCourseTable.id));

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("[ENROLL_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Updates a user's progress in an enrolled course.
 */
export async function PUT(req) {
  try {
    const { completedChapter, courseId } = await req.json();

    // Improvement 3: Added input validation
    if (!courseId || completedChapter === undefined) {
      return NextResponse.json(
        { error: "courseId and completedChapter are required" },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const result = await db
      .update(enrollCourseTable)
      .set({ completedChapters: completedChapter })
      .where(
        and(
          eq(enrollCourseTable.cid, courseId),
          eq(enrollCourseTable.userEmail, userEmail)
        )
      )
      .returning({ id: enrollCourseTable.id });

    if (result.length === 0) {
      return NextResponse.json(
        {
          error:
            "Enrollment not found or you do not have permission to update it.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Progress updated", data: result[0] });
  } catch (error) {
    console.error("[ENROLL_PUT_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
