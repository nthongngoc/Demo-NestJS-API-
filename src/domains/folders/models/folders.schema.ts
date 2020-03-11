import { Table, Column, DataType, Model, UpdatedAt, CreatedAt, ForeignKey } from "sequelize-typescript";
import { Users } from "../../../domains/users/models/users.schema";
import { Files } from "../../../domains/files/models/files.schema";

@Table
export class Folders extends Model<Folders> {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  _id: string

  @Column(DataType.TEXT)
  name: string

  @Column(DataType.TEXT)
  description: string

  @ForeignKey(() => Folders)
  @Column({
    type: DataType.UUID,
  })
  parentFolderID: string

  @ForeignKey(() => Folders)
  @Column({
    type: DataType.ARRAY(DataType.UUID),
    defaultValue: null,
  })
  childFolderIDs: string[]

  @ForeignKey(() => Files)
  @Column({
    type: DataType.ARRAY(DataType.UUID),
    defaultValue: null,
  })
  fileIDs: string[]

  @ForeignKey(() => Users)
  @Column(DataType.UUID)
  createdBy: string

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}
