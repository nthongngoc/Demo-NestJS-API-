import { FileType } from "./files.schema";
import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class FindManyFilesDto {
  @ApiPropertyOptional()
  @IsEnum(FileType)
  @IsOptional()
  readonly type?: FileType
}

export class CreateFileDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string
}

export class UpdateFileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsUUID("4")
  @IsOptional()
  folderID?: string
}
