import httpStatus from 'http-status';
import { IChangePassword, ILoginUser, ILoginUserResponse, IRefreshTokenResponse } from '../interfaces/auth.interface';
import ApiError from '../utils/errors/apiError.util';
import { User } from '../models/user.model';
import { jwtHelpers } from '../utils/helpers/jwtHelpers.util';
import config from '../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
const loginUser = async (payload: ILoginUser):Promise<ILoginUserResponse> => {
  const { email, password } = payload;
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Match password
  if (isUserExist.password && !await User.isPasswordMatch(password, isUserExist.password))
     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');

  const {id,role} = isUserExist;
  //create access token
  const accessToken = jwtHelpers.createToken({
    id,
    email,
    role 
  },config.jwt.secret as Secret,  config.jwt.expires_in as string)
  
  //create refresh token
  const refreshToken = jwtHelpers.createToken({
    id,
    email,
    role 
  },config.jwt.refresh_secret as Secret,  config.jwt.refresh_expires_in as string)
  
  return {
    accessToken,
    refreshToken
  };
};

const refreshToken = async (token:string):Promise<IRefreshTokenResponse> =>{
 //verify token
 let verifiedToken = null;
 try {
   verifiedToken = jwtHelpers.verifiedToken(
     token,
     config.jwt.refresh_secret as string
   );
 } catch (error) {
   throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
 }

 const { email } = verifiedToken;

 const isUserExist = await User.isUserExist(email);

 if (!isUserExist) {
   throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
 }

 // generate new token
 const newAccessToken = jwtHelpers.createToken(
   { id: isUserExist.id, role: isUserExist.role },
   config.jwt.secret as Secret,
   config.jwt.expires_in as string
 );

 return {
   accessToken: newAccessToken,
 };
}
const changePassword = async (userData:JwtPayload | null,payload:IChangePassword):Promise<void> =>{

  const { oldPassword, newPassword } = payload;

  const isUserExist = await User.findOne({ email: userData?.email }).select( '+password');
  if (!isUserExist)  throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  
  // checking old password
  if (
    isUserExist &&
    !(await User.isPasswordMatch(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ' Old password is incorrect');
  }

  isUserExist.password = newPassword;
  isUserExist.save();
}

export const Authservice = {
  loginUser,
  refreshToken,
  changePassword
};
