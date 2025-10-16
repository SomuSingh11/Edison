"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Map } from "lucide-react";
import { List } from "lucide-react";

import ChapterAccordionView from "./ChapterAccordionView";
import ChapterMapView from "./ChapterMapVieww";

const ChapterTopicList = ({ course }) => {
  const courseLayout = course?.courseJson?.course;
  const [view, setView] = useState("list");

  return (
    <div className="p-6 mt-10 bg-gray-50 rounded-2xl">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Course Curriculum
          </h2>
          <p className="mt-1 text-gray-500">
            Explore the chapters and topics you'll learn in this course.
          </p>
        </div>
        {/* The Toggle Buttons */}
        <div className="flex p-1 bg-gray-200 rounded-lg">
          <Button
            onClick={() => setView("list")}
            variant={"ghost"}
            className={`transition-all hover:cursor-pointer ${
              view === "list"
                ? "bg-white text-gray-500 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <List className="w-4 h-4 mr-2" /> List View
          </Button>
          <Button
            onClick={() => setView("map")}
            variant={view === "ghost"}
            className={`transition-all hover:cursor-pointer ${
              view === "map"
                ? "bg-white text-gray-500 shadow-sm"
                : "text-gray-500"
            }`}
          >
            <Map className="w-4 h-4 mr-2" /> Map View
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {view === "list" ? (
          <ChapterAccordionView courseLayout={courseLayout} />
        ) : (
          <ChapterMapView courseLayout={courseLayout} />
        )}
      </div>

      <div className="flex flex-col items-center mt-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
        <h3 className="mt-2 text-xl font-semibold">
          You've reached the end of the curriculum.
        </h3>
        <p className="text-gray-500">Happy learning!</p>
      </div>
    </div>
  );
};

export default ChapterTopicList;
