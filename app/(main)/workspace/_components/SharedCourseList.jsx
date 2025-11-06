"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EnrollCourseCard from "./EnrollCourseCard"; // Use EnrollCourseCard as these are courses the user can learn from
import { FolderKanban, LoaderCircle } from "lucide-react"; // Changed icons
import CourseCard from "./CourseCard";

function SharedCourseList() {
  const [sharedCourseList, setSharedCourseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSharedCourses();
  }, []);

  const getSharedCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await axios.get("/api/courses/share");
      setSharedCourseList(result.data || []); // Ensure it's always an array
    } catch (e) {
      console.error("Failed to fetch enrolled courses", e);
      setError("Could not load shared courses. Please try again later.");
      setSharedCourseList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="p-6 mt-8 bg-gray-50/70 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800">
          Courses Shared With You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
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

  // --- Error State ---
  if (error) {
    return (
      <div className="p-6 mt-8 text-center text-red-600">
        <h2 className="text-xl font-semibold">Error Loading Courses</h2>
        <p>{error}</p>
        <button
          onClick={getSharedCourses}
          className="mt-4 px-4 py-2 border rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- Empty State ---
  if (sharedCourseList.length === 0) {
    return (
      <div className="p-6 mt-8 bg-gray-50/70 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800">
          Courses Shared With You
        </h2>
        <div className="flex flex-col items-center justify-center p-10 mt-4 text-center border-2 border-dashed rounded-xl bg-white">
          <FolderKanban className="w-16 h-16 text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            No Courses Shared Yet
          </h3>
          <p className="mt-1 text-gray-500">
            Courses shared with you by creators will appear here.
          </p>
        </div>
      </div>
    );
  }

  // --- List of Shared Courses ---
  return (
    <div className="p-6 mt-8 bg-gray-50/70 rounded-2xl">
      <div className="flex items-center gap-3">
        {/* You can add an icon here if desired */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Courses Shared With You
          </h2>
          <p className="text-gray-500">
            Courses you have been granted access to.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {sharedCourseList.map((course, index) => (
          // The API returns { course: {...}, enrollment: {...} }
          // Pass the necessary parts to CourseCard
          <CourseCard course={course} key={index} />
        ))}
      </div>
    </div>
  );
}

export default SharedCourseList;
