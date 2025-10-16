"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Image from "next/image";

function AddNewCourseDialog({ children }) {
  const childElement = React.Children.toArray(children).find((c) =>
    React.isValidElement(c)
  );

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    includeVideo: true,
    noOfChapters: 5,
    category: "",
    level: "",
  });
  const router = useRouter();

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onGenerate = async () => {
    const courseId = uuidv4();
    try {
      setLoading(true);
      const result = await axios.post("/api/generate-course-layout", {
        ...formData,
        courseId: courseId,
      });
      setLoading(false);
      router.push("/workspace/edit-course/" + result.data?.courseId);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  const isFormValid = formData.name && formData.level && formData.category;

  return (
    <Dialog>
      {childElement ? (
        <DialogTrigger asChild>{childElement}</DialogTrigger>
      ) : (
        <DialogTrigger>
          <Button>Create Course</Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <Image
              src="/edison.png"
              alt="Edison"
              width={26}
              height={26}
              priority
            />
            Create New Course with Edison
          </DialogTitle>
          <DialogDescription className="text-gray-500 pt-2">
            Fill in the details below and let our AI build the foundation of
            your next course.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-4">
          {/* Form Fields */}
          <div className="grid gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Course Name
            </label>
            <Input
              id="name"
              placeholder="e.g., 'Introduction to React'"
              onChange={(e) => onHandleInputChange("name", e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Course Description (Optional)
            </label>
            <Textarea
              id="description"
              placeholder="A brief summary of what the course is about"
              onChange={(e) =>
                onHandleInputChange("description", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <label
                htmlFor="noOfChapters"
                className="text-sm font-medium text-gray-700"
              >
                Chapters
              </label>
              <Input
                id="noOfChapters"
                type="number"
                min="1"
                defaultValue={5}
                onChange={(e) =>
                  onHandleInputChange("noOfChapters", e.target.value)
                }
              />
            </div>
            <div className="grid gap-1.5">
              <label
                htmlFor="level"
                className="text-sm font-medium text-gray-700"
              >
                Difficulty
              </label>
              <Select onValueChange={(v) => onHandleInputChange("level", v)}>
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <Input
              id="category"
              placeholder="e.g., 'Web Development, JavaScript'"
              onChange={(e) => onHandleInputChange("category", e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Include Videos</label>
              <p className="text-xs text-gray-500">
                AI will generate video scripts for each chapter.
              </p>
            </div>
            <Switch
              checked={formData.includeVideo}
              onCheckedChange={(v) => onHandleInputChange("includeVideo", v)}
            />
          </div>

          {/* Action Button */}
          <Button
            onClick={onGenerate}
            disabled={loading || !isFormValid}
            className="mt-4 w-full bg-green-700 text-lg font-semibold hover:bg-green-800"
            size="lg"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            Generate Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewCourseDialog;
