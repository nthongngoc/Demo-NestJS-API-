import { Credentials } from "../../../shared/validateAccess";

export interface Folder {
  _id: string
  name: string
  description: string
  parentFolderID: string
  childFolderIDs: string[]
  fileIDs: string[],
  createdBy: string,
  createdAt: Date
  updatedAt: Date
}

export interface FindOneQuery {
  _id: string
  name?: string
}

export interface FindManyFoldersQuery {
  name?: string
  parentFolderID: string
}

export interface CreateFolder {
  _id?: string
  name: string
  desciption?: string
  parentFolderID: string
  createdBy: string
}

export interface CreateFolderService {
  createFolder: CreateFolder
  credentials: Credentials
}

export interface FindAll {
  total: number,
  list: Folder[]
}

export interface FindManyService {
  query: FindManyFoldersQuery
  credentials: Credentials
}

export interface FindOneService {
  query: FindOneQuery
  credentials: Credentials
}

export interface DeleteOneService {
  query: FindOneQuery
  credentials: Credentials
}

export interface UpdateFolder {
  name?: string
  desciption?: string
  parentFolderID?: string
}

export interface UpdateFolderService {
  query: FindOneQuery
  credentials: Credentials
  updateFolder: UpdateFolder
}

export interface AddFileIDsService {
  query: FindOneQuery
  credentials: Credentials
  addFileID: string
}

export interface RemoveFileIDsService {
  query: FindOneQuery
  credentials: Credentials
  removeFileID: string
}
