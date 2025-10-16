"use client";
import { SelectChapterIndexContext } from "@/context/SelectChapterIndexContext";
import React from "react";
import { useContext } from "react";
import { BookOpen, Video } from "lucide-react";
import YouTube from "react-youtube";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ChapterContent = ({ courseInfo }) => {
  const { selectedChapterIndex } = useContext(SelectChapterIndexContext);
  const courseContent = courseInfo?.courseContent || [];
  const currentChapter = courseContent[selectedChapterIndex];

  // If no chapter is selected yet, show a helpful message.
  if (!currentChapter) {
    return (
      <div className="flex flex-col items-center justify-center p-10 mt-4 text-center md:ml-80">
        <BookOpen className="w-16 h-16 text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-800">
          Select a chapter
        </h3>
        <p className="mt-1 text-gray-500">
          Choose a chapter from the sidebar to begin learning.
        </p>
      </div>
    );
  }

  const videoData = currentChapter.youtubeVideo || [];
  const topics = currentChapter.CourseContent?.topics || [];

  return (
    <div className="p-5 md:p-8  space-y-12">
      {/* --- 3. Simplified Header (No Buttons) --- */}
      <header>
        <p className="text-green-700 font-semibold">
          Chapter {selectedChapterIndex + 1}
        </p>
        <h1 className="text-3xl font-bold text-gray-800">
          {currentChapter.CourseContent.chapterName}
        </h1>
      </header>

      {/* Video Section */}
      {videoData.length > 0 && (
        <section className="p-4 bg-gray-50 rounded-2xl border mt-2 max-w-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-6 h-6 text-green-700" />
            <h2 className="text-xl font-bold text-gray-800">Related Videos</h2>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="flex w-full">
              {videoData.map((video, index) => (
                <CarouselItem
                  key={video?.videoId ?? index}
                  className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2"
                >
                  <div className="aspect-video overflow-hidden rounded-xl shadow-sm bg-white">
                    <YouTube
                      videoId={video.videoId}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: { showinfo: 0, modestbranding: 1 },
                      }}
                      className="w-full h-full"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden sm:flex left-0" />
            <CarouselNext className="hidden sm:flex right-0" />
          </Carousel>
        </section>
      )}

      {/* Topics Section */}
      <section>
        <div className="space-y-8">
          {topics.map((topic, index) => (
            <div
              className="p-6 bg-white border rounded-xl shadow-sm"
              key={topic?.topic ?? index}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 font-bold text-green-800 bg-green-100 rounded-md shrink-0">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {topic.topic}
                </h3>
              </div>
              <div
                className="prose prose-green max-w-none"
                dangerouslySetInnerHTML={{ __html: topic.content }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ChapterContent;
