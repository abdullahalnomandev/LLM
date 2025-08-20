// src/models/lecture.model.ts
import { Schema, model } from 'mongoose';
import { ILecture, LectureModel } from '../interfaces/lecture.interface';

const LectureSchema = new Schema<ILecture, LectureModel>(
  {
    module_id: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
      required: [true, 'Module ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Lecture title is required'],
    },
    video_url: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    pdf_nodes: [
      {
        type: String, // store URLs or file paths of PDFs
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);


export const Lecture = model<ILecture, LectureModel>('Lecture', LectureSchema);
