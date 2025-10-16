"use client";

import React from "react";
import { Sparkles, BookOpen, FileText, Brain } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const FEATURES = [
  {
    title: "Course Outlines",
    description: "Instantly generate comprehensive course structures.",
    icon: BookOpen,
  },
  {
    title: "Study Materials",
    description: "Create detailed learning resources tailored to your needs.",
    icon: FileText,
  },
  {
    title: "Interactive Quizzes",
    description: "Test knowledge with dynamic, AI-generated assessments.",
    icon: Brain,
  },
];

function WelcomeBanner() {
  const { user } = useUser();

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-100 p-8 shadow-sm ring-1 ring-black/5">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100/50">
          <Sparkles className="h-8 w-8 text-green-800" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {user?.firstName || "there"}! 👋
          </h2>
          <p className="mt-1 text-gray-600">
            Ready to create something amazing with AI?
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <div
            key={index}
            className="group transform cursor-pointer rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 transition-colors group-hover:bg-green-100/50">
              <feature.icon className="h-6 w-6 text-green-800" />
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WelcomeBanner;
