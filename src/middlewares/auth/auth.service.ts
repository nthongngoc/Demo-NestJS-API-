import { Injectable } from "@nestjs/common";
import { ConfigsService } from "../../configs/configs.service";
import { AccessToken, TokenPayload } from "./types/auth.interface";
import * as jsonwebtoken from 'jsonwebtoken'
import { UsersService } from "../../domains/users/users.service";
import * as bcrypt from 'bcrypt'
import { Users } from "../../domains/users/models/users.schema";

@Injectable()
export class AuthService{
  constructor(
    private readonly configsService: ConfigsService,
    private readonly usersService: UsersService,
  ) { }

  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.usersService.getCurrentUserCredentials({email})

    const isValid = user && user.password && await bcrypt.compare(password, user.password)

    if (!isValid) {
      return null
    }

    delete user.password
    return user
  }

  async generateJWT(user: any): Promise<AccessToken> {
    const payload: TokenPayload = {
      _id: user._id.toString()
    }

    const accessToken = await jsonwebtoken.sign(
      payload,
      this.configsService.JWTSecret,
      { expiresIn: '2y' },
    )

    return { accessToken }
  }
}
