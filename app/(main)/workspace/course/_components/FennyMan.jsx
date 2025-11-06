"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Send,
  LoaderCircle,
  Check,
  Copy,
  Trash2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Input } from "@/components/ui/input";

const FennyMan = ({ courseContent, selectedChapterIndex }) => {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSendMessage = async () => {
    const currentChapter = courseContent[selectedChapterIndex];
    if (!currentChapter) {
      return;
    }

    setIsAnalyzing(true);
    setAiResponse("");

    try {
      const response = await fetch("/api/fenny", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userInput,
          chapterContext: currentChapter.CourseContent,
        }),
      });

      if (!response.body) {
        throw new Error("The response body is empty.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setAiResponse((prev) => prev + chunkValue);
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setAiResponse("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsAnalyzing(false);
      setUserInput("");
    }
  };

  const handleCopy = () => {
    const plainText = aiResponse.replace(/<[^>]*>/g, "");
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    toast.success("Response copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setAiResponse("");
    toast.success("Response cleared!");
  };

  return (
    <div className="w-3/4 space-y-4 z-50">
      {/* Input Area */}
      <div className="flex items-end gap-2 ">
        <Input
          placeholder="Ask Fenny"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" &&
            !isAnalyzing &&
            userInput &&
            handleSendMessage()
          }
          disabled={isAnalyzing}
          className="flex-1 backdrop-blur-md"
        />
        <Button
          onClick={handleSendMessage}
          disabled={isAnalyzing || !userInput}
          className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
        >
          {isAnalyzing ? (
            <LoaderCircle className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
      {/* Response Area - Only shows when there's content */}
      {aiResponse && (
        <div className="p-4 absolute w-3/4 max-h-[500px] overflow-y-auto bg-white backdrop-blur-md border border-blue-200/50 rounded-lg animate-in fade-in-50">
          <div data-color-mode="light">
            <MDEditor.Markdown
              source={aiResponse || "The AI did not provide a response."}
              className="w-full h-full"
            />
          </div>
          <div className="absolute mt-2 top-2 right-2 flex gap-2 backdrop-blur-lg bg-gray-100/70 p-1 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8 hover:bg-white/50 hover:cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8 hover:bg-white/50 hover:cursor-pointer text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FennyMan;
