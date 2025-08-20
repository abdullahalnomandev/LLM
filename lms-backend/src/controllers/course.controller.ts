import { Response, Request } from 'express';
import { CourseService } from '../services/course.service';
import { ICourse } from '../interfaces/course.interface';
import httpStatus from 'http-status';
import catchAsync from '../utils/helpers/catchAsync.util';
import sendResponse from '../utils/helpers/sendResponse.util';


const create= catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.create(req.body);

  sendResponse<ICourse>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Course created successfully',
    data: result,
  });
});

// Get all Courses
const getAll = catchAsync(async (req: Request, res: Response) => {
  // const filters = pick(req.query, courseFilterableFields || []);
  // const paginationOptions = pick(req.query, paginationFields);

  const result = await CourseService.getAll(); // filters/pagination can be added if needed

  sendResponse<ICourse[]>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Courses retrieved successfully',
    data: result,
  });
});


const getSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.getById(id);

  sendResponse<ICourse | null>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Course retrieved successfully',
    data: result,
  });
});


const updateOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await CourseService.update(id, updateData);

  sendResponse<ICourse | null>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Course updated successfully',
    data: result,
  });
});


const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CourseService.remove(id);

  sendResponse<ICourse | null>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Course deleted successfully',
    data: result,
  });
});

export const CourseController = {
  create,
  getAll,
  getSingle,
  updateOne,
  deleteOne
};
