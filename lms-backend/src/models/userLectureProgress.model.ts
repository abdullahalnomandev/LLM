import { Schema, model } from 'mongoose';
import { optional } from 'zod';
import { IUserLectureProgress, UserLectureProgressModel } from '../interfaces/userLectureProgress.interface';

export enum LECTURE_STATUS {
  LOCKED = 'locked',
  IN_PROGRESS = 'in_progress', 
  COMPLETED = 'completed'
}

const UserLectureProgressSchema = new Schema<IUserLectureProgress, UserLectureProgressModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    lectureId: {
      type: Schema.Types.ObjectId,
      ref: 'Lecture',
      required: [true, 'Lecture ID is required']
    },
    status: {
      type: String,
      enum: Object.values(LECTURE_STATUS),
      default: LECTURE_STATUS.COMPLETED,
      required: [true, 'Status is required']
    },
    watchedSeconds: {
      type: Number,
      default: 0,
      optional:true,
      required: [true, 'Watched seconds is required']
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

UserLectureProgressSchema.index({ userId: 1, lectureId: 1 });

export const UserLectureProgress = model<IUserLectureProgress, UserLectureProgressModel>('UserLectureProgress', UserLectureProgressSchema);
