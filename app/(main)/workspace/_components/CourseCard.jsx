import { Button } from "@/components/ui/button";
import axios from "axios";
import { Book, LoaderCircle, PlayCircle, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const CourseCard = ({ course }) => {
  const [loading, setLoading] = useState(false);
  const courseJson = course?.courseJson?.course;
  const hasContent = Boolean(course?.courseContent?.length);

  return (
    <div className="rounded-xl mt-4 overflow-hidden bg-white shadow-sm hover:shadow-lg transition-transform duration-200 ease-out hover:-translate-y-1">
      <div className="relative">
        <Image
          src={course?.bannerImageUrl || "/online-education.png"}
          alt={courseJson?.name || course?.name || "Course banner"}
          width={360}
          height={202}
          className="w-full aspect-video object-cover"
        />

        {/* subtle gradient so text/icons contrast on image */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent pointer-events-none"
          aria-hidden
        />

        <span className="absolute top-2 left-2 inline-flex items-center gap-2 bg-white/90 text-xs text-gray-800 px-1.5 py-0.5 rounded-md shadow-sm">
          <Book className="h-3.5 w-3.5 text-gray-700" />
          <span className="font-medium text-xs">
            {courseJson?.noOfChapters ?? 0} chapters
          </span>
        </span>
      </div>

      <div className="p-3 flex flex-col gap-2.5">
        <h3 className="font-semibold text-md leading-5 line-clamp-2">
          {courseJson?.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3">
          {courseJson?.description}
        </p>

        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2 bg-gray-100 px-1.5 py-0.5 rounded-md">
              <PlayCircle className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs">
                {courseJson?.estimatedDuration ?? "—"}
              </span>
            </span>
          </div>

          <div>
            {hasContent ? (
              <Link href={`/workspace/view-course/${course?.cid}`}>
                <Button
                  size="sm"
                  disabled={loading}
                  className="flex items-center gap-2 px-2 py-1 hover:cursor-pointer"
                >
                  {loading ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <PlayCircle className="h-3.5 w-3.5" />
                  )}
                  Open
                </Button>
              </Link>
            ) : (
              <Link href={`/workspace/edit-course/${course?.cid}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 px-2 py-1 hover:cursor-pointer"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Overview
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
