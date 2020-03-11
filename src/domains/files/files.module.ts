import { Module, forwardRef } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { FilesService } from './files.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Files } from './models/files.schema';
import { FoldersModule } from '../folders/folders.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Files]),
    FirebaseModule,
    forwardRef(() => FoldersModule),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})

export class FilesModule { }
