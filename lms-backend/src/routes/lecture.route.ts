// src/routes/lecture.route.ts
import express from 'express';
import auth from '../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../enums/user';
import { LectureController } from '../controllers/lecture.controller';

const router = express.Router();

// Create Lecture
router.post(
  '/',
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), // uncomment if needed
  LectureController.create
);

// Get all Lectures (optionally by module)
router.get('/', LectureController.getAll);



// Get by module Id 
router.get('/module/:moduleId', LectureController.getByModule);


// Get single Lecture
router.get('/:id', LectureController.getSingle);

// Update Lecture
router.patch(
  '/:id',
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), // uncomment if needed
  LectureController.updateOne
);

// Delete Lecture
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  LectureController.deleteOne
);

export const LectureRoutes = router;
