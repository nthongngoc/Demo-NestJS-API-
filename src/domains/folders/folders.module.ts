import { FoldersService } from "./folders.service";
import { FoldersController } from "./folders.controller";
import { forwardRef, Module } from "@nestjs/common";
import { Folders } from "./models/folders.schema";
import { SequelizeModule } from "@nestjs/sequelize";
import { FilesModule } from "../files/files.module";


@Module({
  imports: [
    SequelizeModule.forFeature([Folders]),
    forwardRef(() => FilesModule),
  ],
  controllers: [FoldersController],
  providers: [FoldersService],
  exports: [FoldersService]
})

export class FoldersModule { }
