import apiClient from "@/lib/apiClient";
import { IModule } from "@/types/module";

export const getModules = async (courseId: string, query: Record<string, any> = {}): Promise<IModule[]> => {
  try {
    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    const url = `/modules/module/${courseId}${queryString ? `?${queryString}` : ''}`;
    const { data } = await apiClient.get(url);
    return data?.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch modules: ${error.message}`);
  }
};

export const getModuleById = async (id: string): Promise<IModule> => {
  try {
    const { data } = await apiClient.get(`/modules/${id}`);
    return data?.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch module: ${error.message}`);
  }
};

export const createModule = async (module: Partial<IModule>): Promise<IModule> => {
  try {
    const { data } = await apiClient.post("/modules", module);
    return data?.data;
  } catch (error: any) {
    throw new Error(`Failed to create module: ${error.message}`);
  }
};

export const updateModule = async (id: string, module: Partial<IModule>): Promise<IModule> => {
  try {
    const { data } = await apiClient.patch(`/modules/${id}`, module);
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update module: ${error.message}`);
  }
};

export const deleteModule = async (id: string): Promise<IModule> => {
  try {
    const { data } = await apiClient.delete(`/modules/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(`Failed to delete module: ${error.message}`);
  }
};