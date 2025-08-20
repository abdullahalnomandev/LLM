import CreateModule from "@/components/Module/CreateModule";
import { getCourseById, getCourses } from "@/services/courseService";
import React from "react";

interface Params {
  params: { course_id: string };
}

export default async function CreateCoursePage({ params }: Params) {
  const { course_id } = params;

  // Fetch the course for default selection
  const courseData = await getCourseById(course_id);

  // Optionally, fetch all courses for the dropdown
  // const courses = await getCourses();

  return <CreateModule courseData={courseData}/>;
}
