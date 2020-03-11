import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, ArrayNotEmpty, IsArray, ArrayUnique} from "class-validator";

export class CreateFolderDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty()
  @IsString()
  @IsUUID("4")
  readonly parentFolderID: string;
}

export class FindManyFoldersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID("4")
  readonly parentFolderID: string;
}

export class UpdateFolderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID("4")
  readonly parentFolderID?: string;
}

export class AddFilesDto {
  @ApiProperty()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @IsUUID("4")
  readonly fileIDs: string[];
}

export class RemoveFilesDto {
  @ApiProperty()
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray()
  @IsUUID("4")
  readonly fileIDs: string[];
}
