import { ApiTags } from "@nestjs/swagger";
import { Controller, Post, UseGuards, Body, Request, UsePipes, Get, Param, Put, Delete, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateFolderDto, UpdateFolderDto, FindManyFoldersDto } from "./models/folders.dto";
import { Folder, FindAll } from "./models/folders.interface";
import { FoldersService } from "./folders.service";
import { ValidationPipe } from "../../middlewares/pipes/validation.pipe";
import { Authorization } from "../../middlewares/authz/authz.service";

@ApiTags('Folders')
@Controller('folders')
export class FoldersController {
  constructor(
    private readonly foldersService: FoldersService,
  ) { }

  @Post()
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async createOne(
    @Request() { user },
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<Folder> {
    try {

      const newFolder = await this.foldersService.create({
        createFolder: {...createFolderDto, createdBy: user._id},
        credentials: user,
      })

      return newFolder
    } catch (error) {
      throw error
    }
  }

  @Get()
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async findMany(
    @Request() { user },
    @Query() findManyFoldersDto: FindManyFoldersDto,
  ): Promise<FindAll> {
    try {

      const folders = await this.foldersService.findMany({
        query: findManyFoldersDto,
        credentials: user,
      })

      return folders
    } catch (error) {
      throw error
    }
  }

  @Get(':folderID')
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async findOne(
    @Request() { user },
    @Param() { folderID },
  ): Promise<Folder> {
    try {

      const folder = await this.foldersService.findOne({
        query: folderID,
        credentials: user,
      })

      return folder
    } catch (error) {
      throw error
    }
  }

  @Delete(':folderID')
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  async deleteOne(
    @Request() {user},
    @Param() { folderID }
  ): Promise<boolean> {
    try {
      const isDeleted = await this.foldersService.deleteOne({
        query: {
          _id: folderID,
        },
        credentials: user,
      })

      return isDeleted
    } catch (error) {
      throw error
    }
  }

  @Put(':folderID')
  @UseGuards(Authorization)
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async updateOne(
    @Request() { user },
    @Param() { folderID },
    @Body() updateFolderDto: UpdateFolderDto,
  ): Promise<boolean> {
    try {
      const isUpdated = await this.foldersService.updateOne({
        query: folderID,
        credentials: user,
        updateFolder: updateFolderDto,
      })

      return isUpdated
    } catch (error) {
      throw error
    }
  }
}
