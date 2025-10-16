"use client";
import { Gift, ListVideo, Clock, BookOpen } from "lucide-react";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ChapterAccordionView = ({ courseLayout }) => {
  // State to control which accordions are open
  const [openItems, setOpenItems] = useState(["0"]);

  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={setOpenItems}
      className="space-y-4"
    >
      {courseLayout?.chapters.map((chapter, index) => (
        <AccordionItem
          key={index}
          value={String(index)}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group"
        >
          <AccordionTrigger className="px-6 py-3 hover:no-underline hover:bg-gradient-to-r hover:from-green-50/70 hover:to-transparent transition-all duration-200 [&[data-state=open]]:bg-gradient-to-r [&[data-state=open]]:from-green-50/70 [&[data-state=open]]:to-transparent">
            <div className="flex items-center gap-4 w-full">
              {/* Chapter Number Badge */}
              <div className="relative">
                <div className="flex items-center justify-center min-w-[3rem] h-12 font-bold text-white bg-gradient-to-br from-green-600/40 to-green-900/50 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  {index + 1}
                </div>
              </div>

              {/* Chapter Info */}
              <div className="flex-1 text-left hover:cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-800 transition-colors">
                  {chapter.chapterName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    {chapter.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                    <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                    {chapter.topics?.length} topics
                  </span>
                </div>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 pb-6 pt-4">
            <div className="relative pl-6 space-y-4">
              {/* Vertical Line */}
              <div className="absolute left-2 top-0 bottom-6 w-0.5 bg-gradient-to-b from-green-200 via-green-100 to-transparent"></div>

              {/* Topics List */}
              {chapter.topics.map((topic, topicIndex) => (
                <div
                  key={topicIndex}
                  className="relative flex items-start gap-4 group/topic hover:cursor-pointer"
                >
                  {/* Topic Icon */}
                  <div className="relative z-10 flex items-center justify-center min-w-[2.5rem] h-10 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm group-hover/topic:shadow-md group-hover/topic:from-green-100 group-hover/topic:to-green-200 transition-all duration-200">
                    <ListVideo className="w-4 h-4 text-green-700" />
                  </div>
                  {/* Topic Text */}
                  <div className="flex-1 pt-2">
                    <p className="text-gray-700 leading-relaxed group-hover/topic:text-gray-900 transition-colors">
                      {topic}
                    </p>
                  </div>
                </div>
              ))}

              {/* Chapter Assessment -- THEME CHANGED HERE */}
              <div className="relative flex items-center gap-4 pt-3 mt-2 border-t border-gray-100">
                <div className="relative z-10 flex items-center justify-center min-w-[2.5rem] h-10 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg shadow-sm">
                  <Gift className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="font-semibold text-gray-900">
                    Chapter Assessment
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Test your knowledge with a quiz
                  </p>
                </div>
                <div className="flex items-center justify-center px-3 h-7 text-xs font-medium text-purple-700 bg-purple-50 rounded-full mt-1.5">
                  Quiz
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChapterAccordionView;
