import EditModule from "@/components/Module/EditModule";
import { getLectureByModuleId } from "@/services/lectureService";
import { getModuleById } from "@/services/moduleService";
import { ILecture } from "@/types/lecture";
export default async function ModulePage({ params }: { params: { module_id: string, course_id: string } }) {
  const { module_id: moduleId } = params;
  
  try {
    const [moduleData, lectures] = await Promise.all([
      getModuleById(moduleId),
      getLectureByModuleId(moduleId)
    ]);

    if (!moduleData) {
      throw new Error('Module not found');
    }
    return <EditModule moduleData={moduleData} lectures={lectures.filter((lecture) => lecture !== undefined) as ILecture[]} />;
  } catch (error) {
    console.error('Error loading module:', error);
    throw error;
  }
}
