// src/interfaces/course.interface.ts
import { Model } from 'mongoose';

export type ICourse = {
  thumbnail: string;
  title: string;
  price: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  module?:number;
  lecture?:number;
}

// Extending Mongoose Model type
export type CourseModel = Model<ICourse, Record<string, unknown>>;
