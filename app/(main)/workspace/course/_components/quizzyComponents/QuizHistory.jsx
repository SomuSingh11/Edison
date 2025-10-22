import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LoaderCircle, Inbox, History } from "lucide-react";

const QuizHistory = ({ history, isLoading, chapterName, onSelectQuiz }) => {
  return (
    <div className="p-6 border h-full rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <History className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Quiz History</h3>
        <span className="text-sm text-gray-400">•</span>
        <span className="text-sm text-gray-600">
          {chapterName?.replace(/^\d+\.\s*/, "")}
        </span>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
          <LoaderCircle className="w-8 h-8 animate-spin mb-4" />
          <p>Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
          <Inbox className="w-12 h-12 mb-4" />
          <p>No previous quizzes found for this chapter.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {history.map((quiz, index) => (
            <li
              key={quiz.quizId}
              onClick={() => onSelectQuiz(quiz)}
              className="flex justify-between items-center p-3 border rounded-md bg-gray-50 hover:cursor-pointer"
            >
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  <span>{index + 1}. </span>
                  {quiz.title.replace(/^\d+\.\s*/, "") ||
                    `Quiz taken on ${new Date(
                      quiz.createdAt
                    ).toLocaleString()}`}
                </p>
                <p className="text-xs text-gray-500">
                  {quiz.totalQuestions} Questions
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizHistory;
