import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "../../../domains/users/users.service";
import { ConfigsService } from "../../../configs/configs.service";
import { ReqUser } from "../types/auth.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configsService: ConfigsService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configsService.JWTSecret,
    })
  }

  async validate(payload: any): Promise<ReqUser> {
    try {
      const userData = await this.usersService.getCurrentUserCredentials({ _id: payload._id })

      if (!userData) {
        throw new UnauthorizedException()
      }

      return {
        _id: userData._id,
        email: userData.email,
        role: userData.roleID
      }
    } catch(error) {
      return Promise.reject(error)
    }
  }
}
