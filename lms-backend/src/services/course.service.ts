import { ICourse } from '../interfaces/course.interface';
import { Course } from '../models/course.model';
import { Lecture } from '../models/lecture.model';
import { Module } from '../models/module.model';

const create = async (payload: ICourse): Promise<ICourse> => {
  const course = await Course.create(payload);
  return course;
};

const getAll = async (): Promise<ICourse[]> => {
  const courses = await Course.aggregate([
    {
      $lookup: {
        from: 'modules',
        localField: '_id',
        foreignField: 'course',
        as: 'modules',
      },
    },
    {
      $lookup: {
        from: 'lectures',
        let: { moduleIds: '$modules._id' },
        pipeline: [
          {
            $match: {
              $expr: { $in: ['$module_id', '$$moduleIds'] }, // Make sure field matches your schema
            },
          },
        ],
        as: 'allLectures',
      },
    },
    {
      $addFields: {
        module: { $size: '$modules' }, // Number of modules
        lecture: { $size: '$allLectures' }, // Number of lectures
      },
    },
    {
      $project: {
        title: 1,
        price: 1,
        description: 1,
        thumbnail: 1,
        module: 1,
        lecture: 1,
        createdAt: 1, // Added createdAt to projection
      },
    },
    { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order (newest first)
  ]);
  return courses;
};

const getById = async (id: string): Promise<ICourse | null> => {
  const course = await Course.findById(id).lean();
  if (!course) return null;

  // Count modules
  const modulesCount = await Module.countDocuments({ course: course._id });

  // Count lectures in all modules
  const lecturesCountAgg = await Module.aggregate([
    { $match: { course: course._id } },
    {
      $lookup: {
        from: 'lectures',
        localField: '_id',
        foreignField: 'module_id',
        as: 'lectures',
      },
    },
    {
      $group: {
        _id: null,
        totalLectures: { $sum: { $size: '$lectures' } },
      },
    },
  ]);

  const lecturesCount = lecturesCountAgg[0]?.totalLectures || 0;

  return {
    ...course,
    module: modulesCount,
    lecture: lecturesCount,
  };
};

const update = async (
  id: string,
  payload: Partial<ICourse>
): Promise<ICourse | null> => {
  const updatedCourse = await Course.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedCourse;
};

const remove = async (id: string): Promise<ICourse | null> => {
  const deletedCourse = await Course.findByIdAndDelete(id);
  return deletedCourse;
};

export const CourseService = {
  create,
  getAll,
  getById,
  update,
  remove,
};
