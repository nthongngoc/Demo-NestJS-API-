import { Injectable } from '@nestjs/common';
import { credential, initializeApp, storage } from 'firebase-admin';
import { ConfigsService } from '../../configs/configs.service';
import { UploadFileService, GenerateSignedUrlService, DeleteFileService, DeleteManyFilesService } from './types/firebase.interface';

@Injectable()
export class FirebaseService {
  constructor(
    private readonly configsService: ConfigsService
  ) {
    initializeApp({
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      credential: credential.cert(require(configsService.firebaseServiceAccountPath)),
      storageBucket: `${configsService.firebaseStorageBucket}.appspot.com/`
    })
  }

  async uploadFileToFirebase({fileID, folderID, fileContent}: UploadFileService): Promise<string> {
    try {
      const mimeType = fileContent.originalname.split(".");
      const fileName = `${folderID}-${fileID}.${mimeType[mimeType.length-1].toLowerCase()}`
      const file = storage().bucket().file(fileName)
      const url = `https://storage.googleapis.com/${this.configsService.firebaseStorageBucket}/${fileName}`;

      const blobStream = file.createWriteStream({
        metadata: {
          contentType: fileContent.mimeType,
        }
      });

      blobStream.on('error', (error) => {
        return Promise.reject(`Something is wrong! Unable to upload at the moment.\n ${error}`);
      });

      blobStream.on('finish', () => {
        console.log("Updated successfully!")
        return Promise.resolve(url);
      });

      blobStream.end(fileContent.buffer);

      return url
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async generateSignedUrl({ folderID, fileID, mimeType }: GenerateSignedUrlService): Promise<string> {
    try {
      const fileName = `${folderID}-${fileID}.${mimeType.toLowerCase()}`
      const file = storage().bucket().file(fileName)
      const url = await file.getSignedUrl({
        action: "read",
        expires: new Date().setHours(new Date().getHours() + 2)
      })

      return url[0]
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteFileFromCloud({ folderID, fileID, mimeType }: DeleteFileService): Promise<boolean> {
    try {
      const fileName = `${folderID}-${fileID}.${mimeType.toLowerCase()}`
      const file = storage().bucket().file(fileName)

      await file.delete()
      console.log('File was deleted!!!')

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteFilesInFolderFromCloud({ folderID }: DeleteManyFilesService): Promise<boolean> {
    try {
      await storage().bucket().deleteFiles({
        prefix: folderID
      })

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
