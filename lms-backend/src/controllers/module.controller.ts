// src/controllers/module.controller.ts
import { Response, Request } from 'express';
import { IModule } from '../interfaces/module.interface';
import httpStatus from 'http-status';
import catchAsync from '../utils/helpers/catchAsync.util';
import sendResponse from '../utils/helpers/sendResponse.util';
import { ModuleService } from '../services/module.service';
import pick from '../utils/helpers/pick.util';
import { paginationFields } from '../constants/pagination';
import { moduleFilterableFields } from '../constants/module.constant';

// Create Module
const create = catchAsync(async (req: Request, res: Response) => {
  const result = await ModuleService.create(req.body);

  sendResponse<IModule>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Module created successfully',
    data: result,
  });
});

// Get all Modules
const getAll = catchAsync(async (req: Request, res: Response) => {
  const moduleId = req?.params?.id;
  const filters = pick(req.query, moduleFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ModuleService.getAll(filters, paginationOptions, moduleId);


  // const result = await ModuleService.getAll(moduleId);

  sendResponse<IModule[]>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Modules retrieved successfully',
    meta:result.meta,
    data: result.data,
  });
});

// Get single Module
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ModuleService.getById(id);

  sendResponse<IModule | null>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Module retrieved successfully',
    data: result,
  });
});

// Update Module
const updateOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await ModuleService.update(id, updateData);

  sendResponse<IModule | null>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Module updated successfully',
    data: result,
  });
});

// Delete Module
const deleteOne = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ModuleService.remove(id);

  sendResponse<IModule | null>(res, {
    statusCode: httpStatus.OK,
    status: 'success',
    message: 'Module deleted successfully',
    data: result,
  });
});

export const ModuleController = {
  create,
  getAll,
  getSingle,
  updateOne,
  deleteOne,
};
