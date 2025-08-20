import { ILecture } from "./lecture";

export interface IModule {
  _id: string;
  title: string; 
  module_number: number;
  course:string;
  createdAt: Date;
  updatedAt: Date;
  lectures?:ILecture[]
}
