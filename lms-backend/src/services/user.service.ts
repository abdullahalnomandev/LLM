import { SortOrder } from "mongoose";
import { userSearchableFields } from "../constants/user.constant";
import { IUser, IUserFilters } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { IGenericResponse } from "../types/common";
import { IPaginationOptions } from "../types/pagination";
import ApiError from "../utils/errors/apiError.util";
import { paginationHelper } from "../utils/helpers/paginationHelper.util";
import { generateUserId } from "../utils/user.utils";


const createUser = async (user: IUser): Promise<IUser | null> => {
  // Check if user already exists with the same email
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    // throw new ApiError(400, 'User already exists with this email');
    throw new ApiError(500,'User already exists with this email');
  }

  const createUser = await User.create(user);

  if (!createUser) {
    throw new ApiError(400, 'Failed to create user');
  }

  if (!user.id) {
    const id = await generateUserId();
    user.id = id;
  }
  return createUser;
};

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  // Handle search term filtering
  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  // Handle additional filters
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Extract pagination details
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(paginationOptions);

  // Construct sorting conditions
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }


  // Query users with filters, sorting, and pagination
  const whereCondition = andConditions.length ? { $and: andConditions } : {};
  const users = await User.find(whereCondition).sort(sortConditions).skip(skip).limit(limit);

  // Get total user count
  const total = await User.countDocuments();

  return {
    meta: { page, limit, total },
    data: users,
  };
};

const getUserById = async (id: string):Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
}
const updateUserById = async (id: string, payload: Partial<IUser>):Promise<IUser | null> => {
  return await User.findOneAndUpdate({_id:id}, payload,{new:true});

}

const deleteUserById = async (id: string):Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
}

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
