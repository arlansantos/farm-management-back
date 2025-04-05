import { ApiProperty } from "@nestjs/swagger";
import { CropEntity } from "../entities/crop.entity";
import { Type } from "class-transformer";

export class FindAllCropResponseDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty({ type: CropEntity, isArray: true })
  @Type(() => CropEntity)
  data: CropEntity[];
}