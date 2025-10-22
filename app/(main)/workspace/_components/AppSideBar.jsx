"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Book,
  Compass,
  LayoutDashboard,
  PencilRuler,
  Plus,
  UserCircle2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import AddNewCourseDialog from "./AddNewCourseDialog";
import { UserButton, useUser } from "@clerk/nextjs";

const NAVIGATION_ITEMS = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/workspace",
  },
  {
    title: "My Learning",
    icon: Book,
    path: "/workspace/my-learning",
  },
  {
    title: "Explore Courses",
    icon: Compass,
    path: "/workspace/explore",
  },
  {
    title: "AI Tools",
    icon: PencilRuler,
    path: "/workspace/ai-tools",
  },
];

const AppSidebar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  const isActivePath = (itemPath) => {
    if (itemPath === "/workspace") {
      return pathname === "/workspace";
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between border-b p-3">
          <Link
            href="/workspace"
            className="flex items-center gap-3"
            aria-label="Edison - Go to dashboard"
          >
            <Image
              src="/logo.svg"
              alt="Edison"
              width={26}
              height={26}
              priority
            />
            <h1 className="font-mono text-2xl font-light tracking-tight text-gray-800">
              Edison
            </h1>
          </Link>

          <AddNewCourseDialog>
            <button
              title="Create a new course"
              type="button"
              aria-label="Create new course"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
            </button>
          </AddNewCourseDialog>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = isActivePath(item.path);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.path}
                        className={`relative p-5 text-base transition-colors ${
                          isActive
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-green-700/50 rounded-r-full" />
                        )}
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
          <UserButton afterSignOutUrl="/" />
          <div className="flex flex-col">
            <p className="text-sm  text-gray-800 -mb-1">
              Hi, <span className="font-semibold">{user?.fullName}</span>
            </p>
            <p className="text-xs text-gray-500">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
