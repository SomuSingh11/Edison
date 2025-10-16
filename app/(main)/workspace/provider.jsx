import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AppSideBar from "./_components/AppSideBar";

function WorkSpaceProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="relative w-full">
        <SidebarTrigger className="absolute top-5 left-1.5 z-10 hover:bg-gray-100 rounded-md transition-colors"></SidebarTrigger>
        <div className="p-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}

export default WorkSpaceProvider;
