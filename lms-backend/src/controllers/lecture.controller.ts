// src/controllers/lecture.controller.ts
import { Response, Request } from 'express';
import { ILecture } from '../interfaces/lecture.interface';
import httpStatus from 'http-status';
import catchAsync from '../utils/helpers/catchAsync.util';
import sendResponse from '../utils/helpers/sendResponse.util';
import { LectureService } from '../services/lecture.service';
import pick from '../utils/helpers/pick.util';
import { lectureFilterableFields } from '../constants/lecture.constant';
import { paginationFields } from '../constants/pagination';

// Create Lecture
const create = catchAsync(async (req: Request, res: Response) => {
  const result = await LectureService.create(req.body);

  sendResponse<ILecture>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Lecture created successfully',
    data: result,
  });
});

// Get all Lectures
const getAll = catchAsync(async (req: Request, res: Response) => {
  // Optionally, filter by module_id
  const filters = pick(req.query, lectureFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await LectureService.getAll(filters,paginationOptions);

  sendResponse<ILecture[]>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Lectures retrieved successfully',
    meta:result.meta,
    data: result.data,
  });
});

// Get single Lecture
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LectureService.getById(id);

  sendResponse<ILecture | null>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Lecture retrieved successfully',
    data: result,
  });
});

// Get single Lecture
const getByModule = catchAsync(async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const result = await LectureService.getByModuleId(moduleId);

  sendResponse<ILecture | null | unknown>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Lecture retrieved successfully',
    data: result,
  });
});

// Update Lecture
const updateOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await LectureService.update(id, updateData);

  sendResponse<ILecture | null>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Lecture updated successfully',
    data: result,
  });
});

// Delete Lecture
const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LectureService.remove(id);

  sendResponse<ILecture | null>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Lecture deleted successfully',
    data: result,
  });
});

export const LectureController = {
  create,
  getAll,
  getSingle,
  updateOne,
  deleteOne,
  getByModule
};
