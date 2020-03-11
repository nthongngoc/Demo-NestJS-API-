import { Gender } from "./users.schema";
import { DataTypes } from "sequelize";
import { Credentials } from "../../../shared/validateAccess";

export interface UserLoginResponse {
  token: string
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  age: number
  gender: Gender
  dob: Date
  email: string
  phoneNumber: string
  roleID: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserService {
  _id?: string
  firstName: string
  lastName: string
  age: number
  gender: Gender
  dob: Date
  email: string
  phoneNumber: string
  password: string
  roleID: string
  folderID: string
}

export interface GetCurrentUserCredentials {
  email?: string;
  _id?: string
}

export interface FindOne {
  _id: string
  credentials: Credentials
}

export interface UpdateOne {
  firstName?: string
  lastName?: string
  age?: number
  gender?: Gender
  dob?: Date
  phoneNumber?: string
  password?: string
}

export interface UpdateOneService {
  _id: string
  credentials: Credentials,
  updateUser: UpdateOne,
}

export interface FindAllService {
  credentials : Credentials
}

export interface FindAll {
  total: number,
  list: User[]
}
