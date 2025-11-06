"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  FileText,
  Brain,
  Map,
  Wand2,
  Users,
  Edit3,
  Video,
  Twitter,
  Instagram,
  Image,
  FileCode,
  Share2,
  History,
  Bot,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import AddNewCourseDiaglog from "./AddNewCourseDiaglog copy";

const MAIN_FEATURES = [
  {
    title: "AI-Generated Course Overviews",
    description:
      "Get instant, comprehensive course structures with detailed breakdowns and interactive map views to visualize your learning journey.",
    icon: Map,
    gradient: "from-purple-500 to-indigo-600",
    glowColor: "purple-500/20",
  },
  {
    title: "One-Click Content Generation",
    description:
      "Let AI create your entire course content instantly. Review, customize, and publish—all powered by intelligent automation.",
    icon: Wand2,
    gradient: "from-emerald-500 to-teal-600",
    glowColor: "emerald-500/20",
  },
  {
    title: "Domain-Agnostic Learning",
    description:
      "Create courses on any topic imaginable—from quantum physics to cooking, music theory to machine learning.",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-600",
    glowColor: "amber-500/20",
  },
];

const EDITING_FEATURES = [
  {
    title: "Block-Level Editing",
    description:
      "Chapter-wise notes with granular control. Add, remove, and rearrange content blocks effortlessly.",
    icon: Edit3,
  },
  {
    title: "Rich Media Integration",
    description:
      "Embed YouTube videos, Twitter/Instagram posts, articles, images, and LaTeX equations seamlessly.",
    icons: [Video, Twitter, Instagram, Image, FileCode],
  },
  {
    title: "Personal & Shared Courses",
    description:
      "Create private courses or share with students. Teachers can make live updates that sync instantly.",
    icon: Share2,
  },
];

const AI_FEATURES = [
  {
    title: "AI-Fenny Assistant",
    description:
      "Your personalized AI tutor with chapter-specific context awareness for targeted help.",
    icon: Bot,
    accent: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100/80 dark:bg-pink-900/30",
  },
  {
    title: "Smart Quizzes",
    description:
      "Auto-generated, chapter-wise assessments with complete history tracking and analytics.",
    icon: Brain,
    accent: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100/80 dark:bg-blue-900/30",
  },
  {
    title: "Collaborative Sharing",
    description:
      "Teachers share notes that update in real-time for all students. Stay synchronized, always.",
    icon: Users,
    accent: "text-green-600 dark:text-green-400",
    bg: "bg-green-100/80 dark:bg-green-900/30",
  },
];

function WelcomeBanner() {
  const { user } = useUser();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 -m-5 backdrop-blur-md ring-1 ring-black/5 dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900 dark:ring-white/10">
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-200 to-teal-300 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-green-200 to-emerald-300 blur-3xl"></div>
      </div>

      <div className="relative z-10 mt-4">
        {/* Header Section */}
        <div className="flex items-center gap-5 mb-10">
          <div className="flex h-16 w-16 flex-shrink-0 hover:cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl shadow-green-500/30 dark:from-emerald-400 dark:to-green-500">
            <AddNewCourseDiaglog>
              <Plus className="h-8 w-8 text-white" />
            </AddNewCourseDiaglog>
          </div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-green-300 dark:via-emerald-400 dark:to-teal-400">
              Welcome back, {user?.firstName || "there"}! 👋
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Your AI-powered course creation platform awaits
            </p>
          </div>
        </div>

        {/* Main Features - Large Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {MAIN_FEATURES.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredCard(`main-${index}`)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative overflow-hidden hover:cursor-pointer rounded-2xl bg-white/70 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur-xl transition-all duration-500 dark:bg-gray-800/70 dark:ring-white/10
                         hover:-translate-y-2 hover:shadow-2xl hover:shadow-${feature.glowColor}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              <div className="relative">
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg shadow-${feature.glowColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Creation & Editing */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Powerful Content Tools
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {EDITING_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group rounded-xl hover:cursor-pointer bg-white/60 p-4 shadow ring-1 ring-black/5 backdrop-blur-lg transition-all duration-300 dark:bg-gray-800/60 dark:ring-white/10 hover:shadow-lg hover:ring-emerald-500/20 dark:hover:ring-emerald-400/20"
              >
                <div className="flex gap-4">
                  <div className="flex items-center justify-center">
                    {feature.icons ? (
                      <div className="flex -space-x-2">
                        {feature.icons.slice(0, 3).map((Icon, i) => (
                          <div
                            key={i}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 ring-2 ring-white dark:from-emerald-900/40 dark:to-teal-900/40 dark:ring-gray-800"
                          >
                            <Icon className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40">
                        <feature.icon className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              AI-Powered Intelligence
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {AI_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden hover:cursor-pointer rounded-xl bg-white/60 p-6 shadow ring-1 ring-black/5 backdrop-blur-lg transition-all duration-300 dark:bg-gray-800/60 dark:ring-white/10 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute top-0 right-0 h-24 w-24 opacity-10 group-hover:opacity-20 transition-opacity">
                  <feature.icon className="h-full w-full" />
                </div>

                <div className="relative">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.accent}`} />
                  </div>

                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h4>

                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
