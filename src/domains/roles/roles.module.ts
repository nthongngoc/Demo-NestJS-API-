import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Roles } from "./models/roles.schema";
import { RolesService } from "./roles.service";

@Module({
  imports: [SequelizeModule.forFeature([Roles])],
  providers: [RolesService],
  exports: [RolesService],
})

export class RolesModule { }
