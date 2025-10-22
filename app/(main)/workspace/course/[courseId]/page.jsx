"use client";
import React, { useEffect, useState } from "react";
import ChapterContent from "../_components/ChapterContent";
import { useParams } from "next/navigation";
import axios from "axios";
import ChapterListSidebar from "../_components/ChapterListSidebar";

const CoursePage = () => {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourseData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(`/api/courses?courseId=${courseId}`);
      setCourseInfo(result.data);
    } catch (error) {
      console.error("Failed to fetch course data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (isLoading) {
    return <div>Loading course...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-18px)] -m-6">
      <div className="w-80 shrink-0 border-r bg-white p-4 overflow-y-auto">
        <ChapterListSidebar courseInfo={courseInfo} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <ChapterContent
          courseInfo={courseInfo}
          courseId={courseId}
          refreshData={fetchCourseData}
        />
      </div>
    </div>
  );
};

export default CoursePage;
