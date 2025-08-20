// src/interfaces/module.interface.ts
import { Model, Types } from 'mongoose';

export type IModule = {
  isNew: any;
  title: string;
  module_number: number;
  course: Types.ObjectId; // Reference to the Course model
  createdAt?: Date;
  updatedAt?: Date;
}

export type ModuleModel = Model<IModule, Record<string, unknown>>;


export type IModuleFilters = {
  searchTerm?: string;
};