"use client";
import AppHeader from "@/app/(main)/workspace/_components/AppHeader";
import React, { useEffect, useState } from "react";
import ChapterContent from "../_components/ChapterContent";
import { useParams } from "next/navigation";
import axios from "axios";
import ChapterListSidebar from "../_components/ChapterListSidebar";

const Course = () => {
  const { courseId } = useParams();
  const [courseInfo, setCourseInfo] = useState();
  useEffect(() => {
    GetEnrolledCourseById();
  }, []);

  const GetEnrolledCourseById = async () => {
    try {
      const result = await axios.get(`/api/crud-course?courseId=${courseId}`);
      console.log("GetEnrolledCourseById result:", result.data);
      setCourseInfo(result.data);
    } catch (error) {
      console.error("Failed to fetch enrolled course by id", error);
    }
  };
  return (
    <div>
      <div className="flex -m-6">
        <ChapterListSidebar courseInfo={courseInfo} />
        <ChapterContent courseInfo={courseInfo} />
      </div>
    </div>
  );
};

export default Course;
