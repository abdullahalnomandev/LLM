// src/interfaces/module.interface.ts
import { Model, Types } from 'mongoose';

export type IUserLectureProgress = {
  isNew: any;
  userId: Types.ObjectId; // Reference to User model
  lectureId: Types.ObjectId; // Reference to Lecture model
  status: string;
  watchedSeconds?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserLectureProgressModel = Model<IUserLectureProgress, Record<string, unknown>>;

export type IUserLectureProgressFilters = {
  searchTerm?: string;
  userId?: Types.ObjectId;
  lectureId?: Types.ObjectId;
  completed?: boolean;
};