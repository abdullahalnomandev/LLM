import apiClient from "@/lib/apiClient";
import { ILecture } from "@/types/lecture";

export const getLectures = async (query: Record<string, any> = {}): Promise<ILecture[]> => {
  try {
    const queryString = new URLSearchParams(query).toString();
    const { data } = await apiClient.get(`/lectures${queryString ? `?${queryString}` : ''}`);
    return data;
  } catch (error: any) {
    throw new Error(`Failed to fetch lectures: ${error.message}`);
  }
};

export const getLectureById = async (id: string): Promise<ILecture> => {
  try {
    const { data } = await apiClient.get(`/lectures/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch lecture: ${error.message}`);
  }
};

export const getLectureByModuleId = async (id: string): Promise<Partial<ILecture[]>> => {
  try {
    const { data } = await apiClient.get(`/lectures/module/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch lecture: ${error.message}`);
  }
};

export const createLecture = async (lecture: Partial<ILecture>): Promise<ILecture> => {
  try {
    const { data } = await apiClient.post("/lectures", lecture);
    return data?.data;
  } catch (error: any) {
    throw new Error(`Failed to create lecture: ${error.message}`);
  }
};

export const updateLecture = async (id: string, lecture: Partial<ILecture>): Promise<ILecture> => {
  try {
    const { data } = await apiClient.patch(`/lectures/${id}`, lecture);
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update lecture: ${error.message}`);
  }
};

export const deleteLecture = async (id: string): Promise<ILecture> => {
  try {
    const { data } = await apiClient.delete(`/lectures/${id}`);
    getLectures();
    return data;
  } catch (error: any) {
    throw new Error(`Failed to delete lecture: ${error.message}`);
  }
};