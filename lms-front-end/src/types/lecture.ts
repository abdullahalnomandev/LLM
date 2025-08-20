// src/types/lecture.ts
export interface ILecture {
  _id: string;
  module_id: string;
  title: string;
  video_url: string;
  pdf_nodes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  __v: number;
}
