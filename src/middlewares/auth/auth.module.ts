import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from '@nestjs/passport'
import { ConfigsModule } from "../../configs/configs.module";
import { UsersModule } from "../../domains/users/users.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    ConfigsModule,
    PassportModule,
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [AuthService],
})

export class AuthModule { }
