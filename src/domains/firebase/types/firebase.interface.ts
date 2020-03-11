export interface UploadFileService {
  fileID: string
  folderID: string
  fileContent: any
}

export interface GenerateSignedUrlService {
  fileID: string
  folderID: string
  mimeType: string
}

export interface DeleteFileService {
  fileID: string
  folderID: string
  mimeType: string
}

export interface DeleteManyFilesService {
  folderID: string
}
