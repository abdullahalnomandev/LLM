// src/controllers/lecture.controller.ts
import { Response, Request } from 'express';
import { ILecture } from '../interfaces/lecture.interface';
import httpStatus from 'http-status';
import catchAsync from '../utils/helpers/catchAsync.util';
import sendResponse from '../utils/helpers/sendResponse.util';
import pick from '../utils/helpers/pick.util';
import { lectureFilterableFields } from '../constants/lecture.constant';
import { paginationFields } from '../constants/pagination';
import { userLectureVideoProgress } from '../services/userLectureProgress.service';

// Create Lecture
const createVideoProgress = catchAsync(async (req: Request, res: Response) => {
  const { lectureId } = req.params;
  const userId = (req as any).user.id;
  const result = await userLectureVideoProgress.createVideoProgress({
    lectureId,
    userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Video progress created successfully',
    data: result,
  });
});

const getVideoProgress = catchAsync(async (req: Request, res: Response) => {
  const { lectureId } = req.params;
  const userId = (req as any).user.id;

  const result = await userLectureVideoProgress.getVideoProgress({
    lectureId,
    userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Video progress retrieved successfully',
    data: result,
  });
});

const getALl = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await userLectureVideoProgress.getAll(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Video progress retrieved successfully',
    data: result,
  });
});

export const userLectureProgressController = {
  createVideoProgress,
  getVideoProgress,
  getALl,
};
