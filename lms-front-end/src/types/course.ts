// src/types/course.ts
export interface Course {
  _id: string;
  thumbnail: string;
  title: string;
  price: number;
  description: string;
  module: number;
  lecture: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
