import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Roles } from "./models/roles.schema";
import { FindOne } from "./models/roles.interface";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles)
    private readonly rolesModel: typeof Roles,
  ) { }

  async findOne(query: FindOne): Promise<Roles> {
    try {
      const role = await this.rolesModel.findOne({ where: { ...query } })

      if (!role) {
        return Promise.reject({
          code: 404,
          name: 'RoleNotFound'
        })
      }

      return role
    } catch (error) {
      return Promise.reject(error)
    }
  }

}
