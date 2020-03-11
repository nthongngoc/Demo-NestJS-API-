import { FileType } from "./files.schema";
import { Credentials } from "../../../shared/validateAccess";
import { UpdateFileDto } from "./files.dto";

export interface File {
  _id: string
  folderID: string
  type: FileType
  size: number
  name: string
  description: string
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface FindOneQuery {
  _id: string
  folderID: string
  name?: string
}

export interface FindManyQuery {
  folderID: string
  type?: FileType
}

export interface FindManyFilesService {
  query: FindManyQuery
  credentials: Credentials
}

export interface CreateFileQuery {
  _id?: string
  folderID: string
  type: FileType
  name: string
  description?: string
  url: string
  createdBy: string
  updatedBy: string
}

export interface CreateFileService {
  query: CreateFileQuery
  uploadFile: any
  credentials: Credentials
}

export interface FindOneFileService {
  query: FindOneQuery
  credentials: Credentials
}

export interface UpdateOneFileService {
  query: FindOneQuery
  updateFileDto: UpdateFileDto
  credentials: Credentials
}

export interface DeleteOneFileService {
  query: FindOneQuery
  credentials: Credentials
}

export interface DeleteManyFilesService {
  query: FindManyQuery
  credentials: Credentials
}

export interface FindAll {
  total: number
  list: File[]
}
