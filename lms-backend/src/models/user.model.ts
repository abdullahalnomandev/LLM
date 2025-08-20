/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from '../interfaces/user.interface';
import { ENUM_USER_ROLE } from '../enums/user';
import config from '../config';


const UserSchema = new Schema<IUser,UserModel>(
  {
    name: { type: String, required: [true, 'email is required'] },
    email: { type: String, required: [true, 'email is required'] },
    password: {
      type: String,
      select: 0,
      required: [true, 'password is required to create user'],
    },
    role: {
      type: String,
      default: ENUM_USER_ROLE.USER,
      enum: [ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER],
      required: [true, 'role is required to create user'],
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.static('isUserExist', async function (email:string):Promise<Pick<IUser,"email" | "password" | "id" | "role"> | null>{
  return await User.findOne({email},{email:1,password:1,role:1,id:1});
})

UserSchema.static('isPasswordMatch', async function (givenPassword:string,savePassword:string):Promise<boolean>{
  return  await bcrypt.compare(givenPassword,savePassword);
})

// hashing password
UserSchema.pre('save', async function (next) {
    const user = this
    user.password = await bcrypt.hashSync(
      user.password,
      Number(config.bcrypt_salt_round)
    );
  next();
});


export const User = model<IUser, UserModel>('User', UserSchema);
