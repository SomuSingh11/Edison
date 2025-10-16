import { db } from "@/config/db";
import { and, desc, eq, ne } from "drizzle-orm";
import { coursesTable } from "@/config/schema";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const user = await currentUser();

  if (courseId) {
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.cid, courseId));
    return NextResponse.json(result[0]);
  }

  if (user) {
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.userEmail, user.primaryEmailAddress.emailAddress))
      .orderBy(desc(coursesTable.id));

    return NextResponse.json(result);
  }

  // Fallback
  return NextResponse.json([]);
}
