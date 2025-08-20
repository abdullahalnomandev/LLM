import React from "react";
import { getCourses } from "@/services/courseService";
import AllCourseCard from "@/components/Course/AllCourse";

export default async function CourseDetailsPage() {
  try {
    const courses = await getCourses();

    if (!courses || courses.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">
            No courses available at the moment. Please try again later.
          </p>
        </div>
      );
    }

    return <AllCourseCard courses={courses} />;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">
          Failed to load courses. Please try again later.
        </p>
      </div>
    );
  }
}
