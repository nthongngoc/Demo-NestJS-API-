import { Injectable, forwardRef, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Files } from "./models/files.schema";
import { File, CreateFileService, UpdateOneFileService, FindOneFileService, FindManyFilesService, DeleteOneFileService, DeleteManyFilesService, FindAll } from "./models/files.interface";
import { ValidateAccessToSingle, ValidateAccessToList } from "../../shared/validateAccess";
import { FirebaseService } from "../firebase/firebase.service";
import { FoldersService } from "../folders/folders.service";

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Files)
    private readonly filesModel: typeof Files,
    @Inject(forwardRef(() => FoldersService))
    private readonly foldersService: FoldersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  private readonly validateAccessToSingle = ValidateAccessToSingle
  private readonly validateAccessToList = ValidateAccessToList

  async findMany({ query, credentials }: FindManyFilesService): Promise<FindAll> {
    try {
      const files = await this.filesModel.findAll({
        where: {
          ...query
        }
      })

      const {validData, validDataLength } = this.validateAccessToList({
        data: files,
        credentials
      })

      const result = await Promise.all(validData.map(async (each) => {
        each.url = await this.firebaseService.generateSignedUrl({
          fileID: each._id,
          folderID: each.folderID,
          mimeType: each.type
        })

        return each
      }))

      return {
        total: validDataLength,
        list: validData
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOne({ query, credentials }: FindOneFileService): Promise<File> {
    try {
      const file = await this.filesModel.findOne({
        where: {
          ...query
        }
      })

      this.validateAccessToSingle({
        data: file,
        credentials
      })

      file.url = await this.firebaseService.generateSignedUrl({
        fileID: file._id,
        folderID: file.folderID,
        mimeType: file.type
      })

      return file
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createOne({ query, uploadFile, credentials}: CreateFileService): Promise<boolean> {
    try {
      this.validateAccessToSingle({
        data: {
          ...query
        },
        credentials
      })

      const file = await this.filesModel.create({
        ...query,
        size: uploadFile.size,
      })

      await this.foldersService.addFileIntoFolder({
        query: {
          _id: file.folderID,
        },
        credentials,
        addFileID: file._id
      })

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async updateOne({ query, updateFileDto, credentials }: UpdateOneFileService): Promise<boolean> {
    try {
      const file = await this.filesModel.findOne({
        where: {
          ...query
        }
      })

      this.validateAccessToSingle({
        data: file,
        credentials
      })

      const [number, _] = await this.filesModel.update(
        updateFileDto,
        { where: {
          ...query
        }}
      )

      if (updateFileDto.folderID != null) {
        await Promise.all([
          this.foldersService.addFileIntoFolder({
            query: {
              _id: updateFileDto.folderID
            },
            credentials,
            addFileID: file._id
          }),
          this.foldersService.removeFileFromFolder({
            query: {
              _id: file.folderID,
            },
            credentials,
            removeFileID: file._id
          })
        ])
      }

      return !!number
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteOne({ query, credentials }: DeleteOneFileService): Promise<boolean> {
    try {
      const file = await this.filesModel.findOne({
        where: {
          ...query
        }
      })

      this.validateAccessToSingle({
        data: file,
        credentials
      })

      await Promise.all([
        this.filesModel.destroy({
          where: {
            ...query
          }
        }),
        this.foldersService.removeFileFromFolder({
          query: {
            _id: file.folderID,
          },
          credentials,
          removeFileID: file._id
        })
      ])

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteMany({ query, credentials }: DeleteManyFilesService): Promise<boolean> {
    try {
      const files = await this.filesModel.findAll({
        where: {
          ...query
        }
      })

      this.validateAccessToList({
        data: files,
        credentials
      })

      const { folderID } = query

      await this.filesModel.destroy({where: { folderID }})
      await this.firebaseService.deleteFilesInFolderFromCloud({
        folderID,
      })

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
