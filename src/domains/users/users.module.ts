import { Module, forwardRef } from "@nestjs/common";
import { UsersService } from "./users.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Users } from "./models/users.schema";
import { ConfigsModule } from "../../configs/configs.module";
import { UsersController } from "./users.controller";
import { AuthModule } from "../../middlewares/auth/auth.module";
import { RolesModule } from "../roles/roles.module";
import { FoldersModule } from "../folders/folders.module";

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
    ConfigsModule,
    forwardRef(() => AuthModule),
    RolesModule,
    forwardRef(() => FoldersModule)
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})

export class UsersModule { }
