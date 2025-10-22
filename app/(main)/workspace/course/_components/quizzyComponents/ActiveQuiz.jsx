import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

const ActiveQuiz = ({ questions, onSubmit, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (optionIndex) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: optionIndex });
  };

  return (
    <div className="p-6 border h-full rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-green-700">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <Progress
        value={((currentQuestionIndex + 1) / questions.length) * 100}
        className="mb-6"
      />
      <h3 className="text-lg font-bold mb-6 pt-2">
        {currentQuestion.question}
      </h3>
      <div className="space-y-6">
        {currentQuestion.options.map((option, index) => {
          const isSelected = userAnswers[currentQuestionIndex] === index;
          return (
            <div
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                isSelected
                  ? "bg-green-100 border-green-600 ring-2 ring-green-600"
                  : "hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 ${
                  isSelected
                    ? "bg-green-600 border-green-600"
                    : "border-gray-300"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span>{option}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-10">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className={"hover:cursor-pointer"}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            disabled={userAnswers[currentQuestionIndex] === undefined}
            className="hover:cursor-pointer"
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => onSubmit(userAnswers)}
            disabled={userAnswers[currentQuestionIndex] === undefined}
            className="bg-green-700 hover:bg-green-800 hover:cursor-pointer"
          >
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActiveQuiz;
