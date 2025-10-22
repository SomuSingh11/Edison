import {
  boolean,
  integer,
  json,
  pgTable,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscriptionId: varchar(" subscriptionId", { length: 255 }),
});

export const coursesTable = pgTable("courses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  cid: varchar("cid", { length: 255 }).notNull().unique(),

  name: varchar("name", { length: 255 }),
  description: varchar("description"),
  noOfChapters: integer("  noOfChapters").notNull(),

  includeVideo: boolean("includeVideo").default(false),
  category: varchar("category", { length: 255 }).notNull(),

  isPublic: boolean("isPublic").notNull().default(false),
  isShared: boolean("isShared").notNull().default(false),

  courseJson: json("courseJson"),
  courseContent: json().default({}),
  userEmail: varchar("userEmail", { length: 255 })
    .references(() => usersTable.email)
    .notNull(),
  bannerImageUrl: varchar().default(""),
});

export const enrollmentsTable = pgTable("enrollments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  studentEmail: varchar("student_email", { length: 255 })
    .references(() => usersTable.email)
    .notNull(),

  courseCid: varchar("course_cid", { length: 255 })
    .references(() => coursesTable.cid)
    .notNull(),

  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
});

export const QuizzesTable = pgTable("quizzes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  quizId: varchar("quiz_id", { length: 255 }).notNull().unique(),
  courseId: varchar("course_id", { length: 255 })
    .references(() => coursesTable.cid)
    .notNull(),
  courseName: varchar("course_name", { length: 255 }),
  chapterIndex: integer("chapter_index").notNull(),
  chapterName: varchar("chapter_name", { length: 255 }),
  title: varchar("title", { length: 255 }),
  questions: json("questions").notNull(),
  userAnswers: json("user_answers"),
  totalQuestions: integer("total_questions").notNull(),
  score: integer("score"),
  userEmail: varchar("user_email", { length: 255 })
    .references(() => usersTable.email)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
