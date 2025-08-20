import express from 'express';
import auth from '../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../enums/user';
import { userLectureProgressController } from '../controllers/userLectureProgress.controller';

const router = express.Router();

router.post(
  '/video/:lectureId',
  auth(ENUM_USER_ROLE.USER),
  userLectureProgressController.createVideoProgress
);

router.get('/video/:lectureId',auth(ENUM_USER_ROLE.USER), userLectureProgressController.getVideoProgress);

router.get('/video',auth(ENUM_USER_ROLE.USER), userLectureProgressController.getALl);


export const userLectureProgressRoutes = router;
