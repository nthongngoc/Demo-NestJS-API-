import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Get, Body, Param, Request, UsePipes, Query, Put, Delete } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { FirebaseService } from "../firebase/firebase.service";
import { FileType } from "./models/files.schema";
import { CreateFileDto, FindManyFilesDto, UpdateFileDto } from "./models/files.dto";
import { FilesService } from "./files.service";
import * as uuidv4 from "uuid/v4"
import { ValidationPipe } from "../../middlewares/pipes/validation.pipe";
import { File, FindAll } from "./models/files.interface";
import { Authorization } from "../../middlewares/authz/authz.service";

@ApiTags('Files')
@Controller('folders/:folderID/files')
export class FilesController {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly filesService: FilesService
  ) { }

  @Get()
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async findManyController(@Request() { user }, @Query() findManyFilesDto: FindManyFilesDto, @Param() { folderID }): Promise<FindAll> {
    try {
      const files = this.filesService.findMany({
        query: {
          folderID,
          ...findManyFilesDto
        },
        credentials: {
          ...user
        }
      })

      return files
    } catch (error) {
      throw error
    }
  }

  @Get(':fileID')
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async findOne(@Request() { user }, @Param() { fileID, folderID }): Promise<File> {
    try {
      const file  = this.filesService.findOne({
        query: {
          _id: fileID,
          folderID
        },
        credentials: {
          ...user
        }
      })

      return file
    } catch (error) {
      throw error
    }
  }

  @Post()
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  async createOne(@Request() { user }, @UploadedFile() file, @Body() createFileDto: CreateFileDto, @Param() { folderID }): Promise<boolean> {
    try {
      if (!file.originalname.toLowerCase().match(RegExp(`\.(${FileType.DOC}|${FileType.JPEG}|${FileType.PDF}|${FileType.PNG}|${FileType.SVG}|${FileType.XLSX})$`))) {
        throw new Error('This file\'s type is not supported!');
      }

      const fileID = uuidv4()

      const url = await this.firebaseService.uploadFileToFirebase({
        fileID,
        folderID,
        fileContent: file,
      })

      const type = file.originalname.toLowerCase().split(".")

      const isSuccess = await this.filesService.createOne({
        query: {
          ...createFileDto,
          _id: fileID,
          folderID,
          url,
          type: type[type.length-1],
          createdBy: user._id,
          updatedBy: user._id
        },
        uploadFile: file,
        credentials: user
      })

      return isSuccess
    } catch (error) {
      throw error
    }
  }

  @Put(':fileID')
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async updateOne(@Request() { user }, @Body() updateFileDto: UpdateFileDto, @Param() { folderID, fileID }): Promise<boolean> {
    try {
      const isSuccess = await this.filesService.updateOne({
        query: {
          folderID,
          _id: fileID
        },
        updateFileDto,
        credentials: {
          ...user,
        }
      })

      return isSuccess
    } catch (error) {
      throw error
    }
  }

  @Delete(':fileID')
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async deleteOne(@Request() { user }, @Param() { folderID, fileID }): Promise<boolean> {
    try {
      const isSuccess = await this.filesService.deleteOne({
        query: {
          folderID,
          _id: fileID
        },
        credentials: {
          ...user
        }
      })

      return isSuccess
    } catch (error) {
      throw error
    }
  }
}
