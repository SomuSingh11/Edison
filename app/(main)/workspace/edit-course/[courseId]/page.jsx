"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseInfo from "../_components/CourseInfo";
import ChapterTopicList from "../../_components/ChapterTopicList";

const EditCourse = ({ viewCourse = false }) => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [course, setCourse] = useState();

  const GetCourseInfo = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/courses?courseId=" + courseId);
      setCourse(result.data);
    } catch (error) {
      console.error("Failed to fetch course", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCourseInfo();
  }, []);

  if (loading) {
    return <div>Loading course details...</div>;
  }
  if (!course) {
    return <div>Course not found or failed to load.</div>;
  }

  return (
    <div>
      {/* Contains logic to create course */}
      <CourseInfo
        course={course}
        viewCourse={viewCourse}
        courseId={courseId}
      />{" "}
      <ChapterTopicList course={course} />
    </div>
  );
};

export default EditCourse;
