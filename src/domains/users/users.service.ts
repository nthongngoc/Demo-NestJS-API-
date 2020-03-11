import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConfigsService } from "../../configs/configs.service";
import { Users } from "./models/users.schema";
import { User, CreateUserService, GetCurrentUserCredentials, UpdateOneService, FindOne, FindAllService, FindAll } from "./models/users.interface";
import * as bcrypt from 'bcrypt'
import { ValidateAccessToSingle, ValidateAccessToList } from "../../shared/validateAccess";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private readonly usersModel: typeof Users,
    private readonly configService: ConfigsService,
  ) {}

  private readonly validateAccessToSingle = ValidateAccessToSingle
  private readonly validateAccessToList = ValidateAccessToList

  async create(createUser: CreateUserService): Promise<User> {
    try {

      const salt = await bcrypt.genSalt(this.configService.saltRound)
      createUser.password = await bcrypt.hash(createUser.password, salt)

      const user = await this.usersModel.create(createUser)

      return user
    } catch (error) {
      return  Promise.reject(error)
    }
  }

  async getCurrentUserCredentials(query: GetCurrentUserCredentials): Promise<Users>{
    try {
      const user = await this.usersModel.findOne({ where: {
        ...query
      }})

      if(!user) {
        return null
      }

      return user
    } catch (error) {
      return  Promise.reject(error)
    }
  }

  async findOne({_id, credentials}: FindOne): Promise<User>{
    try {
      const  user = await this.usersModel.findOne({where: {_id}, attributes: {exclude: ['password']}})

      if(!user) {
        Promise.reject({
          code: 404,
          name: 'UserNotFound',
        })
      }

      this.validateAccessToSingle({
        data: user,
        credentials,
      })

      return user
    } catch(error) {
      return Promise.reject(error)
    }
  }

  async findAll({credentials}: FindAllService): Promise<FindAll> {
    try {
      const users = await this.usersModel.findAll({ attributes: { exclude: ['password']}})

      const { validData, validDataLength } = this.validateAccessToList({
        data: users,
        credentials,
      })

      return {
        total: validDataLength,
        list: validData
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async updateOne({_id, credentials, updateUser}: UpdateOneService): Promise<boolean>{
    try {
      const user = await this.usersModel.findOne({where: {_id} })

      if(!user) {
        Promise.reject({
          code: 404,
          name: 'UserNotFound',
        })
      }

      this.validateAccessToSingle({
        data: user,
        credentials,
      })

      const [number, _ ]= await this.usersModel.update( updateUser , { where: { _id }} )

      if (number==1) {
        return true
      } return false

    } catch(error) {
      return Promise.reject(error)
    }
  }
}
