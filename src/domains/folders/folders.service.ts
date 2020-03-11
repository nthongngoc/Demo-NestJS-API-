import { InjectModel } from "@nestjs/sequelize";
import { Folders } from "./models/folders.schema";
import { ValidateAccessToList, ValidateAccessToSingle } from "../../shared/validateAccess";
import { CreateFolderService, Folder, FindManyService, FindAll, FindOneService, DeleteOneService, UpdateFolderService, RemoveFileIDsService, AddFileIDsService } from "./models/folders.interface";
import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { FilesService } from "../files/files.service";

@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folders)
    private readonly foldersModel: typeof Folders,
    private readonly filesService: FilesService
  ) { }

  private readonly validateAccessToSingle = ValidateAccessToSingle
  private readonly validateAccessToList = ValidateAccessToList

  async create({createFolder, credentials }: CreateFolderService): Promise<Folder> {
    try {

      this.validateAccessToSingle({
        data: createFolder,
        credentials,
      })

      const folder = await this.foldersModel.create(createFolder)

      if (folder.parentFolderID != null) {
        await this.foldersModel.update({childFolderIDs: Sequelize.fn('array_append', Sequelize.col('childFolderIDs'), folder._id )}, { where: { _id: folder.parentFolderID }})
      }

      return folder
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findMany({query, credentials}: FindManyService): Promise<FindAll> {
    try {
      const folders = await this.foldersModel.findAll({
        where: {
          ...query
        }
      })

      const { validData, validDataLength } = this.validateAccessToList({
        data: folders,
        credentials,
      })

      return {
        total: validDataLength,
        list: validData
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOne({ query, credentials }: FindOneService ): Promise<Folder> {
    try {
      const folder = await this.foldersModel.findOne({ where: {...query} })

      this.validateAccessToSingle({
        data: folder,
        credentials,
      })

      return folder
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteOne({ query, credentials }: DeleteOneService): Promise<boolean> {
    try {
      const folder = await this.foldersModel.findOne({ where: { ...query }})

      if (!folder) {
        return Promise.reject({
          code: 404,
          name: 'FolderNotFound'
        })
      }

      this.validateAccessToSingle({
        data: folder,
        credentials,
      })

      await this.foldersModel.update({ childFolderIDs: Sequelize.fn('array_remove', Sequelize.col('childFolderIDs'), folder._id )}, { where: { _id: folder.parentFolderID }})

      if(folder.childFolderIDs) {
        folder.childFolderIDs.map(async (each) => {
          await this.foldersModel.destroy({where: {_id: each}})
        })
      }

      await Promise.all([
        this.filesService.deleteMany({
          query: {
            folderID: folder._id
          },
          credentials
        }),
        this.foldersModel.destroy({where: {...query}})
      ])

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async updateOne({ query, credentials, updateFolder}: UpdateFolderService): Promise<boolean> {
    try {
      const folder = await this.foldersModel.findOne({ where: { ...query }})

      if (!folder) {
        return Promise.reject({
          code: 404,
          name: 'FolderNotFound'
        })
      }

      this.validateAccessToSingle({
        data: folder,
        credentials,
      })

      const {parentFolderID } = updateFolder

      if (parentFolderID) {
        await this.foldersModel.update({childFolderIDs: Sequelize.fn('array_append', Sequelize.col('childFolderIDs'), folder._id )}, { where: { _id: parentFolderID }})
        await this.foldersModel.update({ childFolderIDs: Sequelize.fn('array_remove', Sequelize.col('childFolderIDs'), folder._id )}, { where: { _id: folder.parentFolderID }})
      }

      await this.foldersModel.update( updateFolder, { where: { ...query }})

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async addFileIntoFolder({ query, credentials, addFileID}: AddFileIDsService): Promise<boolean> {
    try {
      const folder = await this.foldersModel.findOne({ where: { ...query }})

      if (!folder) {
        return Promise.reject({
          code: 404,
          name: 'FolderNotFund'
        })
      }

      this.validateAccessToSingle({
        data: folder,
        credentials,
      })

      await this.foldersModel.update({fileIDs: Sequelize.fn('array_append', Sequelize.col('fileIDs'), addFileID )}, { where: { _id: folder._id }})

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async removeFileFromFolder({ query, credentials, removeFileID}: RemoveFileIDsService): Promise<boolean> {
    try {
      const folder = await this.foldersModel.findOne({ where: { ...query }})

      if (!folder) {
        return Promise.reject({
          code: 404,
          name: 'FolderNotFund'
        })
      }

      this.validateAccessToSingle({
        data: folder,
        credentials,
      })

      await this.foldersModel.update({fileIDs: Sequelize.fn('array_remove', Sequelize.col('fileIDs'), removeFileID )}, { where: { _id: folder._id }})

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
