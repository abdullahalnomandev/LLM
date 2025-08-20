import { Response, Request } from 'express';
import { Authservice } from '../services/auth.service';
import config from '../config';
import { ILoginUserResponse, IRefreshTokenResponse } from '../interfaces/auth.interface';
import httpStatus from 'http-status';
import catchAsync from '../utils/helpers/catchAsync.util';
import sendResponse from '../utils/helpers/sendResponse.util';

const loginUser = catchAsync(async (req:Request,res:Response) => {
  const { ...loginData } = req.body;
  const result = await Authservice.loginUser(loginData);
  const {refreshToken, ...others} = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly:true
  }
  res.cookie('refreshToken',refreshToken, cookieOptions);
  sendResponse<ILoginUserResponse>(res,{
    statusCode: httpStatus.OK,
    status:'success',
    message:"User logged in successfully!",
    data: others
  })
})

const refreshToken = catchAsync(async (req:Request,res:Response) => {

  const { refreshToken } = req.cookies;
  const result = await Authservice.refreshToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly:true
  }

  res.cookie('refreshToken',refreshToken, cookieOptions);
  sendResponse<IRefreshTokenResponse>(res,{
    statusCode: httpStatus.OK,
    status:'success',
    message:"User logged in successfully!",
    data: result
  })
})

const changePassword = catchAsync(async (req:Request,res:Response) => {

  const {...passwordData} = req.body;
  const user = req.user;
   await Authservice.changePassword(user,passwordData);

  sendResponse<ILoginUserResponse>(res,{
    statusCode: httpStatus.OK,
    status:'success',
    message:"Password updated successfully !",

  })
})

export const AuthController = {
    loginUser,
    refreshToken,
    changePassword
};
