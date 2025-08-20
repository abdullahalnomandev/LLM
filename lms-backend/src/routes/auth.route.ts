import express from 'express';
import validateRequest from '../middlewares/validateRequest.middleware';
import { AuthValidationZodSchema } from '../validations/auth.validation';
import { AuthController } from '../controllers/auth.controller';
import auth from '../middlewares/auth.middleware';
import { ENUM_USER_ROLE } from '../enums/user';


const router = express.Router();

router.post(
  '/login',
  AuthController.loginUser
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidationZodSchema.refreshTokenZodSchema),
  AuthController.refreshToken
);

router.post(
  '/change-password',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.USER
  ),
  validateRequest(AuthValidationZodSchema.changePasswordZodSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
