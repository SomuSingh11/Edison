import { db } from "@/config/db";
import { coursesTable, enrollmentsTable, usersTable } from "@/config/schema";
import { eq, and, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = user.primaryEmailAddress.emailAddress;

    const enrolledCourses = await db
      .select({
        // Select only the columns you need from the courses table
        id: coursesTable.id,
        cid: coursesTable.cid,
        name: coursesTable.name,
        description: coursesTable.description,
        noOfChapters: coursesTable.noOfChapters,
        includeVideo: coursesTable.includeVideo,
        category: coursesTable.category,
        isPublic: coursesTable.isPublic,
        isShared: coursesTable.isShared,
        courseJson: coursesTable.courseJson,
        courseContent: coursesTable.courseContent,
        userEmail: coursesTable.userEmail, // Author email
        bannerImageUrl: coursesTable.bannerImageUrl,
        // You can also select enrollment details if needed
        enrolledAt: enrollmentsTable.enrolledAt,
      })
      .from(enrollmentsTable) // Start from enrollments
      .innerJoin(coursesTable, eq(enrollmentsTable.courseCid, coursesTable.cid)) // Join courses where IDs match
      .where(eq(enrollmentsTable.studentEmail, userEmail)) // Filter enrollments for the current user
      .orderBy(desc(enrollmentsTable.enrolledAt)); // Order by enrollment date

    // 3. Return the list of courses the user is enrolled in
    return NextResponse.json(enrolledCourses);
  } catch (error) {
    console.error("[GET_ENROLLED_COURSES_JOIN_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseCid, studentEmail } = await req.json();
  const teacherEmail = user.primaryEmailAddress.emailAddress;

  // Verify teacher owns this course
  const course = await db
    .select()
    .from(coursesTable)
    .where(
      and(
        eq(coursesTable.cid, courseCid),
        eq(coursesTable.userEmail, teacherEmail)
      )
    )
    .limit(1);

  if (!course.length) {
    return NextResponse.json(
      { error: "Course not found or unauthorized" },
      { status: 403 }
    );
  }

  // Check if student exists
  const student = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, studentEmail))
    .limit(1);

  if (!student.length) {
    return NextResponse.json(
      { error: "Student email not found in system" },
      { status: 404 }
    );
  }

  // Check if already enrolled
  const existing = await db
    .select()
    .from(enrollmentsTable)
    .where(
      and(
        eq(enrollmentsTable.courseCid, courseCid),
        eq(enrollmentsTable.studentEmail, studentEmail)
      )
    );

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Student already has access to this course" },
      { status: 409 }
    );
  }

  // Create enrollment
  await db.insert(enrollmentsTable).values({
    studentEmail: studentEmail,
    courseCid: courseCid,
  });

  return NextResponse.json({
    message: "Course shared successfully",
    courseName: course[0].name,
  });
}
