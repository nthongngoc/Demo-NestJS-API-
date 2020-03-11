import { ConfigsService } from "./configs.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    {
      provide: ConfigsService,
      useValue: new ConfigsService(),
    }
  ],
  exports: [ConfigsService],
})

export class ConfigsModule { }
