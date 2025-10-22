import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import QuizHistory from "./QuizHistory";

const QuizHome = ({
  chapterName,
  onGenerateQuiz,
  history,
  isLoadingHistory,
  onSelectQuiz,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Create Quiz */}
      <div className="p-8 border rounded-lg bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-sm flex flex-col justify-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
            Test Your Knowledge
          </h3>

          {/* Chapter Name Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 rounded-full bg-white border border-green-200 shadow-sm">
            <span className="text-xs font-medium text-gray-700">
              {chapterName?.replace(/^\d+\.\s*/, "")}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mt-3 mb-2 text-sm leading-relaxed">
            Challenge yourself with an AI-powered quiz tailored to your current
            chapter content.
          </p>

          {/* Features List */}
          <div className="flex flex-col gap-2 mb-6 text-xs text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>AI-Generated Questions</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span>Based on Your Chapter Notes</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onGenerateQuiz}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto hover:cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create a New Quiz
          </Button>
        </div>
      </div>

      {/* Right Column - Quiz History */}
      <div className="border rounded-lg bg-white shadow-sm h-full">
        <QuizHistory
          chapterName={chapterName}
          history={history}
          isLoading={isLoadingHistory}
          onSelectQuiz={onSelectQuiz}
          compact={true}
        />
      </div>
    </div>
  );
};

export default QuizHome;
