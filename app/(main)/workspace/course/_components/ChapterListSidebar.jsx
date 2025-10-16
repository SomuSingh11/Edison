"use client";
import React, { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectChapterIndexContext } from "@/context/SelectChapterIndexContext";
import { ListVideo } from "lucide-react";

const ChapterListSidebar = ({ courseInfo }) => {
  // --- Simplified Data Access ---
  // The component now only expects the course object itself.
  const courseContent = courseInfo?.courseContent || [];

  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectChapterIndexContext
  );

  return (
    <nav
      aria-label="Chapters"
      className="hidden md:block left-0 w-90 flex-shrink-0 bg-white border-r p-4 overflow-y-auto"
    >
      <h2 className="text-xl font-bold mb-4 ml-2 -mt-1">{courseInfo?.name}</h2>
      <Accordion
        type="multiple"
        defaultValue={courseContent.map((_, i) => `item-${i}`)} // Keep all chapters expanded
        className="w-full"
      >
        {courseContent.map((chapter, index) => {
          const isSelected = selectedChapterIndex === index;

          return (
            <AccordionItem
              value={`item-${index}`}
              key={index}
              className="border-none"
            >
              <AccordionTrigger
                // The only action is to select the chapter
                onClick={() => setSelectedChapterIndex(index)}
                className={`flex items-center gap-3 p-3 rounded-lg text-left hover:no-underline transition-colors ${
                  isSelected
                    ? "bg-green-100 text-green-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {/* --- Simplified Chapter Number --- */}
                <div
                  className={`flex items-center justify-center w-8 h-8 font-bold rounded-md shrink-0 ${
                    isSelected
                      ? "bg-green-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="flex-1 font-semibold text-gray-800">
                  {chapter.CourseContent.chapterName}
                </span>
              </AccordionTrigger>

              <AccordionContent className="pl-8 pt-2 pb-1">
                <ul className="space-y-2 border-l-2 border-gray-200">
                  {chapter.CourseContent.topics.map((topic, topicIndex) => (
                    <li
                      key={topicIndex}
                      className="flex items-center gap-2 pl-4 text-sm text-gray-600"
                    >
                      <ListVideo className="w-4 h-4 text-gray-400" />
                      {topic.topic}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </nav>
  );
};

export default ChapterListSidebar;
