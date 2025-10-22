"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

import ActiveQuiz from "./quizzyComponents/ActiveQuiz";
import QuizHome from "./quizzyComponents/QuizHome";
import QuizResults from "./quizzyComponents/QuizResults";
import QuizHistory from "./quizzyComponents/QuizHistory";

const Quizzy = ({
  courseContent = [],
  courseId,
  courseName,
  selectedChapterIndex = 0,
  onClose,
}) => {
  const [quizState, setQuizState] = useState("home"); // home | loading | active | results | history
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizHistory, setQuizHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedHistoryQuiz, setSelectedHistoryQuiz] = useState(null);

  const currentChapter = courseContent[selectedChapterIndex]?.CourseContent;

  const generateQuiz = async () => {
    if (!currentChapter) {
      toast.error("No chapter content available to generate quiz.");
      return;
    }

    setQuizState("loading");

    try {
      const response = await axios.post("/api/quiz/create-quiz", {
        chapterContent: currentChapter,
        courseId,
        courseName,
        chapterIndex: selectedChapterIndex,
        chapterName: currentChapter.chapterName,
      });

      const generatedQuestions = response.data?.questions ?? [];

      if (generatedQuestions.length === 0) {
        throw new Error("No questions were generated.");
      }

      setQuestions(generatedQuestions);
      setUserAnswers({});
      setQuizState("active");
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast.error("Failed to generate quiz. Please try again.");
      setQuizState("home");
    }
  };

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    if (!courseId) {
      toast.error("Invalid course ID for fetching history.");
      return;
    }

    setIsLoadingHistory(true);

    try {
      const response = await axios.get(
        `/api/quiz/history?courseId=${courseId}&chapterIndex=${selectedChapterIndex}`
      );

      setQuizHistory(response.data?.quizzes ?? []);
    } catch (error) {
      console.error("Quiz history fetch error:", error);
      toast.error("Failed to fetch quiz history.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleQuizSubmit = (finalAnswers) => {
    setUserAnswers(finalAnswers);
    setQuizState("results");
  };

  const handleSelectHistoryQuiz = (quiz) => {
    setSelectedHistoryQuiz(quiz);
    setQuestions(quiz.questions);
    setUserAnswers(quiz.userAnswers || {});
    setQuizState("results");
  };

  const resetToHome = () => {
    setQuizState("home");
    setQuestions([]);
    setUserAnswers({});
  };

  // --- Conditional Rendering ---
  if (quizState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <LoaderCircle className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <h3 className="text-xl font-bold">Fenny is thinking...</h3>
        <p className="text-gray-500 mt-2">
          Generating a personalized quiz for you.
        </p>
      </div>
    );
  }

  if (quizState === "history") {
    return <QuizHistory history={quizHistory} isLoading={isLoadingHistory} />;
  }

  if (quizState === "active") {
    return (
      <ActiveQuiz
        questions={questions}
        onSubmit={handleQuizSubmit}
        onClose={onClose}
      />
    );
  }

  if (quizState === "results") {
    return (
      <QuizResults
        questions={questions}
        userAnswers={userAnswers}
        onRetake={generateQuiz}
        onClose={onClose}
        resetToHome={resetToHome}
      />
    );
  }

  // Default state → home
  return (
    <QuizHome
      chapterName={currentChapter?.chapterName ?? "Untitled Chapter"}
      onGenerateQuiz={generateQuiz}
      onShowHistory={fetchQuizHistory}
      history={quizHistory}
      onSelectQuiz={handleSelectHistoryQuiz}
    />
  );
};

export default Quizzy;
