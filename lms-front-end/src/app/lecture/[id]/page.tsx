import Lecture from '@/components/Lacture/Lecture'
import { getAllLectureAccess } from '@/services/lectureAccessService'
import { getModules } from '@/services/moduleService'
import React from 'react'

interface LecturePageProps {
  params: {
    id: string
  }
}

export default async function LecturePage({ params }: LecturePageProps) {
  const { id } = params
  const modules = await getModules(id)

  return (
    <Lecture modules={modules}/>
  )
}
