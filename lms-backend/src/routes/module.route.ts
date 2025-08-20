// src/routes/module.route.ts
import express from 'express';
import auth from '../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../enums/user';
import { ModuleController } from '../controllers/module.controller';

const router = express.Router();

// Create Module
router.post(
  '/',
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), // uncomment if needed
  ModuleController.create
);

// Get all Modules
router.get('/module/:id', ModuleController.getAll);

// Get single Module
router.get('/:id', ModuleController.getSingle);

// Update Module
router.patch(
  '/:id',
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN), // uncomment if needed
  ModuleController.updateOne
);

// Delete Module
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  ModuleController.deleteOne
);

export const ModuleRoutes = router;
