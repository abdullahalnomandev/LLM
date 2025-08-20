import CourseDetails from '@/components/Course/CourseDetails';
import { getCourseById } from '@/services/courseService';
import { getModules } from '@/services/moduleService';
import React from 'react';

// params comes from the file name, e.g. app/course/[id]/page.tsx
export default async function CourseDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
    const courseDetails = await getCourseById(id);
    const modules = await getModules(id);

  return (
    <CourseDetails courseDetails={courseDetails} modules={modules}/>
  );
}
