import EditCourse from '@/components/Course/EditCourse'
import { getCourseById } from '@/services/courseService'
import React from 'react'

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const { id } = params
  const course = await getCourseById(id)

  return (
    <>
      <EditCourse course={course} />
    </>
  )
}
