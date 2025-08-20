// src/interfaces/lecture.interface.ts
import { Model, Types } from 'mongoose';

export type ILecture = {
  module_id: Types.ObjectId;  // Reference to the Module model
  title: string;
  video_url: string;
  pdf_nodes?: string[];       // Optional array of PDF URLs
  createdAt?: Date;
  updatedAt?: Date;
}

export type LectureModel = Model<ILecture, Record<string, unknown>>;


export type ILectureFilters = {
  searchTerm?: string;
};