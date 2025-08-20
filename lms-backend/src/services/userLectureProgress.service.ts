import { Lecture } from '../models/lecture.model';
import { UserLectureProgress } from '../models/userLectureProgress.model';

const createVideoProgress = async ({
  lectureId,
  userId,
}: {
  lectureId: string;
  userId: string;
}) => {
  const lecture = await UserLectureProgress.create({
    lectureId,
    userId,
  });
  if (!lecture) {
    throw new Error('Lecture not found');
  }

  // Create or update video progress
  const videoProgress = await UserLectureProgress.findOneAndUpdate(
    { userId, lectureId },
    { userId, lectureId },
    { upsert: true, new: true }
  );

  return videoProgress;
};

const getVideoProgress = async ({
  lectureId,
  userId,
}: {
  lectureId: string;
  userId: string;
}) => {
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    throw new Error('Lecture not found');
  }

  const videoProgress = await UserLectureProgress.findOne({
    userId,
    lectureId,
  });

  return videoProgress;
};
const getAll = async (userId : { userId: string }) => {

  const videoProgress = await UserLectureProgress.find({
    userId,
  },"-_id lectureId").lean();

  return videoProgress;
};
export const userLectureVideoProgress = {
  getVideoProgress,
  createVideoProgress,
  getAll,
};
