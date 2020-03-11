import { Model, Table, Column, DataType, CreatedAt, UpdatedAt, NotNull } from "sequelize-typescript";

export enum FileType {
  PDF = 'pdf',
  XLSX = 'xlsx',
  DOC = 'docx',
  PNG = 'png',
  SVG = 'svg',
  JPEG = 'jpg'
}

@Table
export class Files extends Model<Files> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  _id: string

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  folderID: string

  @Column(DataType.ENUM(FileType.DOC, FileType.JPEG, FileType.PDF, FileType.PNG, FileType.SVG, FileType.XLSX))
  type: FileType

  @NotNull
  @Column({
    type: DataType.DOUBLE,
    allowNull: false
  })
  size: number

  @NotNull
  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  name: string

  @Column(DataType.TEXT)
  description: string

  @Column(DataType.TEXT)
  url: string

  @Column(DataType.UUID)
  createdBy: string

  @Column(DataType.UUID)
  updatedBy: string

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}
