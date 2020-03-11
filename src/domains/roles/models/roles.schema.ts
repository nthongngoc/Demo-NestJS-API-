import { Table, DataType, Column, Model, CreatedAt, UpdatedAt } from "sequelize-typescript";

export enum RoleName {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

@Table
export class Roles extends Model<Roles> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  _id: string

  @Column({
    type: DataType.ENUM(RoleName.ADMIN, RoleName.USER),
  })
  name: RoleName

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}
