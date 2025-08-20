import ManageCourse from "@/components/Course/ManageCourse";
import { getCourses } from "@/services/courseService";

export default async function  Course() {
      const courses = await getCourses();

  return (
   <ManageCourse courses={courses} />
  )
}
