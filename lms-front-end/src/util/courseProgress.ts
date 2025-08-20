import { getLecturesAccess, postLectureProgress as postLectureProgressAPI } from "@/services/lectureAccessService";

export const hasAccessToLecture = async (lectureId: string): Promise<boolean> => {
  try {
    const isComplete = await getLecturesAccess(lectureId);
    return isComplete;
  } catch (error) {
    console.error(`Error checking completion status for lecture ${lectureId}:`, error);
    return false;
  }
};

export const postLectureProgress = async (lectureId: string): Promise<void> => {
  try {
    await postLectureProgressAPI(lectureId);
  } catch (error) {
    console.error(`Error marking lecture ${lectureId} as completed:`, error);
    throw error;
  }
};