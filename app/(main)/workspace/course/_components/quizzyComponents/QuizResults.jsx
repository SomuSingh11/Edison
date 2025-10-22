import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, RefreshCw, XCircle, Undo } from "lucide-react";

const QuizResults = ({
  questions,
  userAnswers,
  onRetake,
  onClose,
  resetToHome,
}) => {
  // Check if we are in "study guide" mode (no answers provided)
  const isStudyGuideMode =
    !userAnswers || Object.keys(userAnswers).length === 0;

  // Calculate the score only if it's a completed quiz
  let finalScore = 0;
  if (!isStudyGuideMode) {
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        finalScore++;
      }
    });
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-end mb-2">
        <Button
          className={"hover:cursor-pointer"}
          variant="ghost"
          size="icon"
          onClick={resetToHome}
        >
          <Undo className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </Button>
      </div>

      {/* --- Conditional Header --- */}
      {isStudyGuideMode ? (
        <>
          <h3 className="text-2xl font-bold text-center text-gray-800">
            Review Answers
          </h3>
          <p className="text-center text-gray-500 mt-2">
            Here are the correct answers for this chapter.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-center text-gray-800">
            Quiz Completed!
          </h3>
          <p className="text-center text-xl font-semibold text-green-700 mt-2">
            Your Score: {finalScore} / {questions.length}
          </p>
        </>
      )}

      {/* Detailed breakdown of questions and answers */}
      <div className="mt-8 space-y-6">
        {questions.map((q, index) => {
          const correctAnswerText = q.options[q.correctAnswer];

          // If it's a completed quiz, get user's answer details
          const userAnswerIndex = isStudyGuideMode ? -1 : userAnswers[index];
          const isCorrect = userAnswerIndex === q.correctAnswer;
          const userAnswerText =
            userAnswerIndex !== undefined && userAnswerIndex !== -1
              ? q.options[userAnswerIndex]
              : "Not Answered";

          return (
            <div key={index} className="pb-4 border-b last:border-b-0">
              <p className="font-semibold text-gray-900 mb-3">
                {index + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {/* Always display Correct Answer */}
                <div className="flex items-start p-3 border border-green-200 bg-green-50 rounded-md text-sm text-green-800">
                  <Check className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <span>{correctAnswerText}</span>
                </div>

                {/* --- Conditional User Answer --- */}
                {/* Only show if it's a completed quiz and the answer was wrong */}
                {!isStudyGuideMode && !isCorrect && (
                  <div
                    className={`flex items-start p-3 border rounded-md text-sm ${
                      userAnswerIndex === undefined
                        ? "bg-gray-50 border-gray-200 text-gray-600"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {userAnswerIndex !== undefined ? (
                      <X className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 mr-2"></div> // Placeholder for alignment
                    )}
                    <span>Your Answer: {userAnswerText}</span>
                  </div>
                )}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <p className="mt-3 text-xs text-gray-600 bg-gray-100 p-2 rounded">
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button onClick={onRetake} className="bg-green-700 hover:bg-green-800">
          <RefreshCw className="w-4 h-4 mr-2" />
          {/* --- Conditional Button Text --- */}
          {isStudyGuideMode ? "Start Quiz" : "Retake Quiz"}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default QuizResults;
