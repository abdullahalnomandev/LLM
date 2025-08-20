"use client";

import dynamic from "next/dynamic";

const AllCourseCard = dynamic(() => import("@/components/Course/AllCourse"), {
  ssr: false,
});

export default function AllCourseCardWrapper({ courses }: { courses: any[] }) {
  return <AllCourseCard courses={courses} />;
}
