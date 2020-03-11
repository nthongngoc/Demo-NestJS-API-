import { Table, Column, DataType, Unique, IsEmail, CreatedAt, UpdatedAt, ForeignKey, Model } from "sequelize-typescript";
import { Roles } from "../../../domains/roles/models/roles.schema";
import { Folders } from "../../../domains/folders/models/folders.schema";

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

@Table
export class Users extends Model<Users>{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  _id: string

  @Column(DataType.TEXT)
  firstName: string

  @Column(DataType.TEXT)
  lastName: string

  @Column(DataType.INTEGER)
  age: number

  @Column({ type: DataType.ENUM(Gender.FEMALE, Gender.MALE, Gender.OTHER) })
  gender: Gender

  @Column(DataType.DATEONLY)
  dob: Date;

  @Unique
  @IsEmail
  @Column({allowNull: false})
  email: string

  @Unique
  @Column({type: DataType.STRING})
  phoneNumber: string

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  password: string

  @ForeignKey(() => Folders)
  @Column(DataType.UUID)
  folderID: string

  @ForeignKey(() => Roles)
  @Column(DataType.UUID)
  roleID: string

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}
