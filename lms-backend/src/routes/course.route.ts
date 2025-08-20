import express from 'express';
import auth from '../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../enums/user';
import { CourseController } from '../controllers/course.controller';

const router = express.Router();

router.post(
  '/',
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CourseController.create
);

router.get('/', CourseController.getAll);

router.get('/:id', CourseController.getSingle);

router.patch(
  '/:id',
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CourseController.updateOne
);

router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CourseController.deleteOne
);

export const CourseRoutes = router;
