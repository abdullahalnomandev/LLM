import apiClient from "@/lib/apiClient";

export const getLecturesAccess = async (lectureId: string): Promise<boolean> => {
  try {
    const { data } = await apiClient.get(`/lecturesProgress/video/${lectureId}`);
    return data?.data?.status === 'completed';
  } catch (error: any) {
    console.error(`Failed to fetch lecture progress for ${lectureId}:`, error.message);
    // Return false if lecture progress doesn't exist yet (new lecture)
    if (error.response?.status === 404) {
      return false;
    }
    throw new Error(`Failed to fetch lectures: ${error.message}`);
  }
};

export const postLectureProgress = async (lectureId: string): Promise<any> => {
  try {
    // POST to mark lecture as completed
    const { data } = await apiClient.post(`/lecturesProgress/video/${lectureId}`);
    return data;
  } catch (error: any) {
    console.error(`Failed to update lecture progress for ${lectureId}:`, error.message);
    throw new Error(`Failed to update lecture progress: ${error.message}`);
  }
};

export const getAllLectureAccess = async (): Promise<any> => {
  try {
    const { data } = await apiClient.get("/lecturesProgress/video");
    return data?.data;
  } catch (error: any) {
    return error?.message
  }
};