"use client";

import React, { useMemo, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Book,
  CheckCircle2,
  Clock4,
  List,
  Loader2,
  PlayCircle,
  Settings,
  Signal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import calculateTotalDuration from "./CalculateTotalDuration";
import StatCard from "./StatCard";

const CourseInfo = ({ course, viewCourse }) => {
  const courseLayout = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // useMemo ensures the calculation only runs when the course data changes
  const totalDuration = useMemo(
    () => calculateTotalDuration(courseLayout?.chapters),
    [courseLayout?.chapters]
  );

  const generateCourseContent = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/generate-course-content", {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
      });
      toast.success("Course content generated successfully!");
      router.replace("/workspace");
    } catch (e) {
      console.error("Error generating course content", e);
      toast.error("An error occurred while generating content.");
    } finally {
      setLoading(false);
    }
  };

  const statColors = {
    duration: { bg: "bg-blue-50", text: "text-blue-600" },
    chapters: { bg: "bg-green-50", text: "text-green-700" },
    level: { bg: "bg-orange-50", text: "text-orange-600" },
    tags: { bg: "bg-purple-50", text: "text-purple-600" },
    video: { bg: "bg-teal-50", text: "text-teal-600" },
  };

  // Extract tags from the category string
  const tags =
    courseLayout?.category
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || [];

  return (
    <div className="grid grid-cols-1 gap-8 rounded-2xl border bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm lg:grid-cols-3">
      {/* Left Column: Course Details */}
      <div className="flex flex-col lg:col-span-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {courseLayout?.name}
        </h1>
        <p className="mt-2 line-clamp-3 text-gray-600">
          {courseLayout?.description}
        </p>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          <StatCard
            icon={Clock4}
            label="Duration"
            value={`${totalDuration || 3} hours`}
            color={statColors.duration}
          />
          <StatCard
            icon={Book}
            label="Chapters"
            value={`${courseLayout?.noOfChapters || 0} Chapters`}
            color={statColors.chapters}
          />
          <StatCard
            icon={Signal}
            label="Difficulty"
            value={courseLayout?.level || "N/A"}
            color={statColors.level}
          />

          <StatCard
            icon={CheckCircle2}
            label="Video Content"
            color={statColors.video}
          >
            <p
              className={`text-sm font-semibold ${
                courseLayout?.includeVideo ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {courseLayout?.includeVideo ? "Included" : "Not Included"}
            </p>
          </StatCard>

          {tags.length > 0 && (
            <div className="md:col-span-2">
              <StatCard icon={List} label="Tags" color={statColors.tags}>
                <div className="flex flex-wrap gap-1 pt-1">
                  {tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </StatCard>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8">
          {!viewCourse ? (
            <Button
              size="lg"
              className="bg-green-700 font-semibold hover:bg-green-800 hover:cursor-pointer"
              onClick={generateCourseContent}
              disabled={loading || !courseLayout}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Settings className="mr-2 h-5 w-5" />
              )}
              Generate Content
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="bg-green-700 font-semibold hover:bg-green-800"
            >
              <Link href={"/workspace/course/" + course?.cid}>
                <PlayCircle className="mr-2 h-5 w-5" />
                Continue Learning
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Right Column: Banner Image */}
      <div className="flex items-center justify-center">
        <Image
          src={course?.bannerImageUrl || "/course-banner.png"}
          alt={courseLayout?.name || "Course Banner"}
          width={700}
          height={400}
          className="aspect-video w-full rounded-xl object-cover shadow-md transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default CourseInfo;
