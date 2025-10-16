"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EnrollCourseCard from "./EnrollCourseCard";
import { BookMarked, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const EnrollCourseList = () => {
  const [enrolledCourseList, setEnrolledCourseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEnrolledCourse();
  }, []);

  const normalizeRow = (row) => {
    let course = row.course || row.courses || row.coursesTable || null;
    let enrollCourse =
      row.enrollCourse || row.enroll || row.enrollCourseTable || null;
    if (!course && row.name && row.description) course = row; // Fallback
    return { course, enrollCourse };
  };

  const getEnrolledCourse = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("/api/enroll-course");
      const normalized = result.data.map((r) => normalizeRow(r));
      setEnrolledCourseList(normalized.filter((n) => n.course));
    } catch (e) {
      console.error("Failed to fetch enrolled courses", e);
      setEnrolledCourseList([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 mt-8 bg-gray-50/70 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {/* Skeleton Loaders for a better loading experience */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-full h-[350px] bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (enrolledCourseList.length === 0) {
    return (
      <div className="p-6 mt-8 bg-gray-50/70 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
        {/* --- Improved Empty State --- */}
        <div className="flex flex-col items-center justify-center p-10 mt-4 text-center border-2 border-dashed rounded-xl bg-white">
          <BookMarked className="w-16 h-16 text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            You haven't enrolled in any courses yet.
          </h3>
          <p className="mt-1 text-gray-500">
            Start your learning journey by finding a course that interests you.
          </p>
          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="bg-green-700 hover:bg-green-800"
            >
              <Link href="/explore">
                <Search className="w-5 h-5 mr-2" />
                Explore Courses
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-8 bg-gray-50/70 rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {enrolledCourseList.map((item, index) => (
          <EnrollCourseCard
            course={item.course}
            enrollCourse={item.enrollCourse}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default EnrollCourseList;
