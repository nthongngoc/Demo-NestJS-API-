import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { ReqUser } from "../types/auth.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(email: string, password: string): Promise<ReqUser> {
    try {
      const userData = await this.authService.validateUser(email, password)

      if (!userData) {
        throw new UnauthorizedException()
      }

      return {
        _id: userData._id,
        email: userData.email,
        role: userData.roleID
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
