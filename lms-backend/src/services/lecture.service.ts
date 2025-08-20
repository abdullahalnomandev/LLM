// src/services/lecture.service.ts
import { Module } from '../models/module.model';
import { Lecture } from '../models/lecture.model';
import ApiError from '../utils/errors/apiError.util';
import { ILecture, ILectureFilters } from '../interfaces/lecture.interface';
import { IModuleFilters } from '../interfaces/module.interface';
import { IPaginationOptions } from '../types/pagination';
import { paginationHelper } from '../utils/helpers/paginationHelper.util';
import { lectureSearchableFields } from '../constants/lecture.constant';
import { SortOrder } from 'mongoose';
import { IGenericResponse } from '../types/common';

// Create a new lecture
const create = async (payload: ILecture): Promise<ILecture> => {
  // Check if the module exists
  const isModuleValid = await Module.findById(payload.module_id, '_id')
    .lean()
    .exec();
  if (!isModuleValid) {
    throw new ApiError(400, 'Module ID is invalid');
  }

  const lecture = await Lecture.create(payload);
  return lecture;
};

// get all lectures

export const getAll = async (
  filters: ILectureFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<any>> => {
  const { searchTerm, ...otherFilters } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  const pipeline: any[] = [];

  // 1️⃣ Search term in lecture fields
  if (searchTerm) {
    const searchConditions = lectureSearchableFields.map(field => ({
      [field]: { $regex: searchTerm, $options: "i" },
    }));
    pipeline.push({ $match: { $or: searchConditions } });
  }

  // 2️⃣ Exact filters on lecture fields
  for (const [key, value] of Object.entries(otherFilters)) {
    if (value !== undefined && value !== null && value !== "") {
      if (key !== "module_id.title" && key !== "module_id.course.title") {
        pipeline.push({ $match: { [key]: value } });
      }
    }
  }

  // 3️⃣ Lookup module
  pipeline.push({
    $lookup: {
      from: "modules",
      localField: "module_id",
      foreignField: "_id",
      as: "module",
    },
  });
  pipeline.push({ $unwind: "$module" });

  // 4️⃣ Lookup course inside module
  pipeline.push({
    $lookup: {
      from: "courses",
      localField: "module.course",
      foreignField: "_id",
      as: "module.course",
    },
  });
  pipeline.push({ $unwind: "$module.course" });

  // 5️⃣ Filters on populated fields
  if (otherFilters['module_id.title' as keyof typeof otherFilters]) {
    pipeline.push({ $match: { "module.title": (otherFilters as any)["module_id.title"] } });
  }
  if (otherFilters['module_id.course.title' as keyof typeof otherFilters]) {
    pipeline.push({ $match: { "module.course.title": (otherFilters as any)["module_id.course.title"] } });
  }

  // 6️⃣ Sorting
  if (sortBy && sortOrder) {
    pipeline.push({ $sort: { [sortBy]: sortOrder === "asc" ? 1 : -1 } });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } }); // default sorting
  }

  // 7️⃣ Count total before pagination
  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await Lecture.aggregate(countPipeline);
  const totalCount = countResult[0]?.total || 0;

  // 8️⃣ Pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // 9️⃣ Project desired fields
  pipeline.push({
    $project: {
      _id: 1,
      title: 1,
      module_id: "$module",
      video_url: 1,
      pdf_nodes: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  });

  const lectures = await Lecture.aggregate(pipeline);

  return {
    meta: {
      page,
      limit,
      total: totalCount,
    },
    data: lectures,
  };
};
// Get lecture by ID
const getById = async (id: string): Promise<ILecture | null> => {
  const lecture = await Lecture.findById(id).populate('module_id'); // Populate module info
  return lecture;
};

// Get lecture by Module ID
const getByModuleId = async (id: string): Promise<ILecture[] | null> => {
  const lecture = await Lecture.find(
    { module_id: id },
    '-video_url -pdf_nodes -createdAt -updatedAt'
  ).lean(); // Populate module info
  return lecture;
};

// Update lecture by ID
const update = async (
  id: string,
  payload: Partial<ILecture>
): Promise<ILecture | null> => {
  const updatedLecture = await Lecture.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedLecture;
};

// Delete lecture by ID
const remove = async (id: string): Promise<ILecture | null> => {
  const deletedLecture = await Lecture.findByIdAndDelete(id);
  return deletedLecture;
};

export const LectureService = {
  create,
  getAll,
  getById,
  update,
  remove,
  getByModuleId,
};
