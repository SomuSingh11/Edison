"use client";
import { useContext, useState } from "react";
import dynamic from "next/dynamic";
import { SelectChapterIndexContext } from "@/context/SelectChapterIndexContext";
import { BookOpen, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import FennyMan from "./FennyMan";
import Quizzy from "./Quizzy";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Dynamically import BOTH the viewer and the editor to prevent SSR errors
const CourseContentViewer = dynamic(() => import("./CourseContentViewer"), {
  ssr: false,
});
const CourseEditor = dynamic(() => import("./CourseEditor"), { ssr: false });

const ChapterContent = ({ courseInfo, courseId, refreshData }) => {
  const { selectedChapterIndex } = useContext(SelectChapterIndexContext);
  const courseContent = courseInfo?.courseContent || [];
  console.log("ChapterContent courseContent:", courseContent);
  const currentChapter = courseContent[selectedChapterIndex];
  //console.log("Current Chapter Index:", selectedChapterIndex);

  const [isEditing, setIsEditing] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  if (!currentChapter) {
    return (
      <div className="flex flex-col items-center justify-center p-10 mt-4 text-center md:ml-80">
        <BookOpen className="w-16 h-16 text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-800">
          Select a Chapter
        </h3>
        <p className="mt-1 text-gray-500">
          Choose a chapter from the sidebar to view its content.
        </p>
      </div>
    );
  }

  // Function to handle saving the updated content
  const handleSaveContent = async (updatedBlocks) => {
    try {
      const fullCourseContent = JSON.parse(JSON.stringify(courseContent));

      // 2. Replace the old chapter's blocks with the new edited blocks.
      const existingChapterContent =
        fullCourseContent[selectedChapterIndex].CourseContent;
      fullCourseContent[selectedChapterIndex].CourseContent = {
        ...existingChapterContent,
        blocks: updatedBlocks.blocks,
      };

      // 3. Send the entire updated course content array to your backend.
      await axios.put("/api/crud-course", {
        courseId: courseInfo.cid,
        content: fullCourseContent,
      });

      toast.success("Content saved successfully!");
      setIsEditing(false); // Exit edit mode
      refreshData(); // Refresh the data to show the latest version
    } catch (error) {
      toast.error("Failed to save content.");
      console.error("Save error:", error);
    }
  };

  const singleChapterArray = [currentChapter];

  return (
    <div className="p-2 px-10 w-full">
      <div className="flex sticky top-0 p-4 z-50 w-full">
        <FennyMan
          courseContent={courseContent}
          selectedChapterIndex={selectedChapterIndex}
        />

        {/* Quizzy Modal */}
        <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="ml-4 hover:cursor-pointer">
              Start Quiz
            </Button>
          </DialogTrigger>
          <DialogContent
            className="w-[80vw] max-w-7xl h-[80vh] overflow-y-auto"
            style={{ width: "60vw", maxWidth: "80vw" }}
          >
            <Quizzy
              courseName={courseInfo?.name}
              courseContent={courseContent}
              courseId={courseId}
              selectedChapterIndex={selectedChapterIndex}
              onClose={() => setIsQuizModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {!isEditing && (
          <Button
            variant="outline"
            className="hover:cursor-pointer ml-auto"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Content
          </Button>
        )}
      </div>

      {/* Conditionally render the viewer or the editor */}
      <div className="mt-2">
        {isEditing ? (
          <CourseEditor
            initialData={currentChapter.CourseContent}
            onSave={handleSaveContent}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <CourseContentViewer courseContent={singleChapterArray} />
        )}
      </div>
    </div>
  );
};

export default ChapterContent;
