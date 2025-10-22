"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { Compass, BookCopy, CheckCircle, PencilRuler } from "lucide-react";

const ExploreCoursesPage = () => {
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [overviewCourses, setOverviewCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublicCourses();
  }, []);

  const getPublicCourses = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("/api/courses");
      const allCourses = result.data;

      // --- Logic to split the courses into two lists ---
      const withContent = [];
      const withoutContent = [];

      allCourses.forEach((course) => {
        if (course.courseContent && course.courseContent.length > 0) {
          withContent.push(course);
        } else {
          withoutContent.push(course);
        }
      });

      setPublishedCourses(withContent);
      setOverviewCourses(withoutContent);
    } catch (e) {
      console.error("Failed to fetch public courses", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-10 p-6 mt-8">
        {/* Skeleton for Published Courses */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Generated Courses
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
        {/* Skeleton for Overviews */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Yet to be Generated
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
      </div>
    );
  }

  // If no courses of any kind exist
  if (publishedCourses.length === 0 && overviewCourses.length === 0) {
    return (
      <div className="p-6 mt-8">
        <div className="flex flex-col items-center justify-center p-10 mt-4 text-center border-2 border-dashed rounded-xl bg-white">
          <BookCopy className="w-16 h-16 text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            No Courses to Explore
          </h3>
          <p className="mt-1 text-gray-500">
            Check back later for new content from the community.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-8 space-y-12">
      {/* --- Section 1: Course Overviews (Content Not Generated) --- */}
      {overviewCourses.length > 0 && (
        <section>
          <div className="flex items-center gap-3">
            <PencilRuler className="w-8 h-8 text-orange-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Explore Overviewsand Generate AI Powered Content
              </h2>
              <p className="text-gray-500">
                These courses are in development. Check out their outlines.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {overviewCourses.map((course, index) => (
              <CourseCard course={course} key={index} />
            ))}
          </div>
        </section>
      )}
      {/* --- Section 2: Published Courses (Content Generated) --- */}
      {publishedCourses.length > 0 && (
        <section>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-700" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Continue where you left...
              </h2>
              <p className="text-gray-500">start learning right away.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {publishedCourses.map((course, index) => (
              <CourseCard course={course} key={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ExploreCoursesPage;
