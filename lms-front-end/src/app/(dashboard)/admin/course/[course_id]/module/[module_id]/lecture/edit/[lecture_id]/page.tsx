import EditLecture from "@/components/Lacture/EditLecture";
import { getLectureById } from "@/services/lectureService";
export default async function EditLecturePage({ params }: { params: { lecture_id: string } }) {
  const lecture = await getLectureById(params.lecture_id);
  return (
    <EditLecture lecture={lecture} />
  );
}
