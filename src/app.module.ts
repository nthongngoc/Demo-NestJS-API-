import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigsService } from './configs/configs.service';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './middlewares/auth/auth.module';
import { FirebaseModule } from './domains/firebase/firebase.module';
import { FilesModule } from './domains/files/files.module';
import { FoldersModule } from './domains/folders/folders.module';
import { RolesModule } from './domains/roles/roles.module';
import { ConfigsModule } from './configs/configs.module';

const configService = new ConfigsService()

const DataBaseModule = SequelizeModule.forRoot({
  ...configService.databaseConfig,
  autoLoadModels: true,
  synchronize: true,
  
})

@Module({
  imports: [
    DataBaseModule,
    UsersModule,
    ConfigsModule,
    RolesModule,
    AuthModule,
    FirebaseModule,
    FoldersModule,
    FilesModule
  ],
})

export class AppModule { }
