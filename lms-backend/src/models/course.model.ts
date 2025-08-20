import { Schema, model } from 'mongoose';
import { CourseModel, ICourse } from '../interfaces/course.interface';

const CourseSchema = new Schema<ICourse, CourseModel>(
  {
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

export const Course = model<ICourse, CourseModel>('Course', CourseSchema);

