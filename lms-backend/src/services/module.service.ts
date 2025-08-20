// src/services/module.service.ts
import mongoose, { PipelineStage } from 'mongoose';
import { IModule, IModuleFilters } from '../interfaces/module.interface';
import { Course } from '../models/course.model';
import { Module } from '../models/module.model';
import ApiError from '../utils/errors/apiError.util';
import { IPaginationOptions } from '../types/pagination';
import { moduleSearchableFields } from '../constants/module.constant';
import { paginationHelper } from '../utils/helpers/paginationHelper.util';

const create = async (payload: IModule): Promise<IModule> => {
  // Check if the course exists
  const isCourseIdValid = await Course.findById(payload.course, '_id')
    .lean()
    .exec();

  if (!isCourseIdValid) {
    throw new ApiError(400, 'Course ID is invalid'); // Throw error instead of just creating
  }

  // Create the module
  const module = await Module.create(payload);
  return module;
};

// Get all modules with lectures
const getAll = async (
  filters: IModuleFilters,
  paginationOptions: IPaginationOptions,
  courseId: string
): Promise<{
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IModule[];
}> => {
  const { searchTerm, ...otherFilters } = filters;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(paginationOptions);

  // Lookup lectures first so we can search them
  const pipeline: PipelineStage[] = [
    {
      $match: {
        course: new mongoose.Types.ObjectId(courseId),
        ...otherFilters,
      },
    },
    {
      $lookup: {
        from: 'lectures',
        localField: '_id',
        foreignField: 'module_id',
        as: 'lectures',
      },
    },
  ];

  // Apply search after lookup
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { 'lectures.title': { $regex: searchTerm, $options: 'i' } },
        ],
      },
    });
  }

  pipeline.push(
    {
      $sort: {
        [sortBy || 'module_number']: (sortOrder === 'asc' ? -1 : 1) as 1 | -1,
      },
    },
    {
      $project: {
        title: 1,
        module_number: 1,
        course: 1,
        lectures: {
          $map: {
            input: '$lectures',
            as: 'lecture',
            in: {
              _id: '$$lecture._id',
              title: '$$lecture.title',
              video_url: '$$lecture.video_url',
              pdf_nodes: '$$lecture.pdf_nodes',
            },
          },
        },
      },
    }
  );

  // Count total separately
  const countPipeline: PipelineStage[] = [...pipeline, { $count: 'total' }];
  const countResult = await Module.aggregate(countPipeline);
  const totalCount = countResult[0]?.total || 0;

  // Get paginated data
  const modules: IModule[] = await Module.aggregate<IModule>([
    ...pipeline,
    { $skip: skip },
    { $limit: limit },
  ]);

  return {
    meta: {
      page,
      limit,
      total: totalCount,
    },
    data: modules,
  };
};

export default getAll;

// Get module by ID
const getById = async (id: string): Promise<IModule | null> => {
  const module = await Module.findById(id); // optional: populate course info
  return module;
};

// Update module by ID
const update = async (
  id: string,
  payload: Partial<IModule>
): Promise<IModule | null> => {
  const updatedModule = await Module.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedModule;
};

// Delete module by ID
const remove = async (id: string): Promise<IModule | null> => {
  const deletedModule = await Module.findByIdAndDelete(id);
  return deletedModule;
};

export const ModuleService = {
  create,
  getAll,
  getById,
  update,
  remove,
};
