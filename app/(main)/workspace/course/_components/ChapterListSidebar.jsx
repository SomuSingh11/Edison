"use client";
import React, { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectChapterIndexContext } from "@/context/SelectChapterIndexContext";
import { Youtube, Heading } from "lucide-react";

const ChapterListSidebar = ({ courseInfo }) => {
  const courseContent = courseInfo?.courseContent || [];
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(
    SelectChapterIndexContext
  );

  return (
    <nav aria-label="Chapters" className="">
      <h2 className="text-xl font-bold mb-4 ml-2 -mt-1 truncate">
        {courseInfo?.name}
      </h2>

      <Accordion type="multiple" className="w-full">
        {courseContent.map((chapter, index) => {
          const isSelected = selectedChapterIndex === index;
          const chapterData = chapter.CourseContent;

          return (
            // ✅ FIX: Add the 'value' prop here
            <AccordionItem
              value={`item-${index}`}
              key={index}
              className="border-none"
            >
              <AccordionTrigger
                onClick={() => setSelectedChapterIndex(index)}
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-left hover:no-underline transition-colors ${
                  isSelected
                    ? "bg-green-100 text-green-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {/* Chapter Number */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-bold ${
                    isSelected
                      ? "bg-green-700 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="flex-1 font-semibold text-gray-800">
                  {chapterData?.chapterName?.replace(/^\d+\.\s*/, "")}
                </span>
              </AccordionTrigger>

              <AccordionContent className="pl-8 pt-2 pb-1">
                <ul className="space-y-1 border-l-2 border-gray-200">
                  {chapterData?.blocks?.map((block, itemIndex) => {
                    let Icon = null;
                    let display = null;

                    if (block.type === "header") {
                      Icon = Heading;
                      display = block.data.text;
                    } else if (
                      block.type === "embed" &&
                      block.data.service === "youtube"
                    ) {
                      Icon = Youtube;
                      display = block.data.caption || "YouTube Video";
                    }

                    if (!Icon) return null;

                    return (
                      <li
                        key={itemIndex}
                        className="flex cursor-pointer items-center gap-2 rounded-md p-2 pl-4 text-sm text-gray-600 transition-colors hover:bg-gray-100"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                        <span>{display}</span>
                      </li>
                    );
                  })}
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
