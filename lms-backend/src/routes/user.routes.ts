import express from 'express';
import validateRequest from '../middlewares/validateRequest.middleware';
import { UserValidationZodSchema } from '../validations/user.validation';
import { UserController } from '../controllers/user.controller';
import auth from '../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../enums/user';

const router = express.Router();

router.post(
  '/create-user',
  UserController.createUser
);

router.get('/:id', UserController.getSingleUser);
router.patch(
  '/:id',
  validateRequest(UserValidationZodSchema.updateUserZodSchema),
  UserController.updateUser
);
router.delete('/:id', UserController.deleteUser);
router.get('/',
  auth(
    ENUM_USER_ROLE.ADMIN  ),
  UserController.getAllUsers);


export const UserRoutes = router;
