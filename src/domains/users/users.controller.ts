import { Controller, Post, Body, UseGuards, Request, UsePipes, Put, Get } from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto, LoginDto, UpdateUserDto } from './models/users.dto'
import { AuthService } from '../../middlewares/auth/auth.service'
import { RolesService } from '../roles/roles.service'
import { AccessToken } from '../../middlewares/auth/types/auth.interface'
import { AuthGuard } from '@nestjs/passport'
import { ValidationPipe } from '../../middlewares/pipes/validation.pipe'
import { User, FindAll } from './models/users.interface'
import { FoldersService } from '../folders/folders.service'
import * as uuid from 'uuid/v4'

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
    private readonly foldersService: FoldersService,
  ) { }

  @Post('auth/signup')
  async signup(
    @Body() createUserDto: CreateUserDto
  ): Promise<AccessToken> {
    try {
      const role = await this.rolesService.findOne({name: 'USER'})
      const userID = uuid()
      const folderID = uuid()

      const [ user ] = await Promise.all([
        this.usersService.create({...createUserDto, roleID: role._id, _id: userID, folderID}),
        this.foldersService.create({
          createFolder: {
            _id: folderID,
            name: createUserDto.firstName,
            parentFolderID: null,
            createdBy: userID
          },
          credentials: { _id: userID },
        })
      ])

      return await this.authService.generateJWT(user)
    } catch (error) {
      throw error
    }
  }

  @Post('auth/login')
  @UseGuards(AuthGuard('local'))
  @UsePipes(new ValidationPipe())
  async login(
    @Request() { user },
    @Body() _: LoginDto,
  ): Promise<AccessToken> {
    try {
      return await this.authService.generateJWT(user)
    } catch (error) {
      throw error
    }
  }

  @Get('users/me')
  @UseGuards(AuthGuard('jwt'))
  async getMe (
    @Request() { user },
  ): Promise<User> {
    try {

      const me = await this.usersService.findOne({
        _id: user._id,
        credentials: user,
      })

      return me
    } catch (error) {
      throw error
    }
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async findManyUsers(
    @Request() { user },
  ): Promise<FindAll> {
    try {
      const data = await this.usersService.findAll({
        credentials: { ...user, isAdmin: true}
      })

      return data
    } catch (error) {
      throw error
    }
  }

  @Put('users/me')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async updateOne (
    @Request() { user },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    try {
      const isUpdated = await this.usersService.updateOne({
        _id: user._id,
        credentials: user,
        updateUser: updateUserDto,
      })

      return isUpdated
    } catch (error) {
      throw error
    }
  }
}
