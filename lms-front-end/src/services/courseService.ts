import apiClient from "@/lib/apiClient";
import { Course } from "@/types/course";


export const getCourses = async (): Promise<Course[]> => {
  try {
    const { data } = await apiClient.get("/courses");
    return data?.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
};

export const getCourseById= async (id:string): Promise<Course> => {
  try {
    const { data } = await apiClient.get(`/courses/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }
};

export const createCourse = async (course: Partial<Course>): Promise<Course> => {
  const { data } = await apiClient.post("/courses", course);
  return data?.data;
};

export const updateCourse = async (id: string, course: Partial<Course>): Promise<Course> => {
  const { data } = await apiClient.patch(`/courses/${id}`, course);
  return data;
};

export const deleteCourse = async (id: string): Promise<Course> => {
  const { data } = await apiClient.delete(`/courses/${id}`);
   getCourses()
  return data;
};