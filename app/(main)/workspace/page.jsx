import React from "react";
import WelcomeBanner from "./_components/WelcomeBanner";
import ExploreCourseList from "./_components/ExploreCourseList";
import SharedCourseList from "./_components/SharedCourseList";

function workspace() {
  return (
    <div>
      <WelcomeBanner />
      <ExploreCourseList />
      <SharedCourseList />
    </div>
  );
}

export default workspace;
