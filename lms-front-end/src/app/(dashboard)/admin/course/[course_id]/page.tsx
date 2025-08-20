import ModuleLectureManagement from '@/components/Module/Module'
import { getModules } from '@/services/moduleService';
export default async function ModulePage({ params }: { params: { course_id: string } }) {
  const { course_id } = params;
  const allModules = await getModules(course_id, {});

  return (
    <ModuleLectureManagement courseId={course_id} allModules={allModules} />
  );
}
