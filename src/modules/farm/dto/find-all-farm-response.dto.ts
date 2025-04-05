import { ApiProperty } from "@nestjs/swagger";
import { FarmEntity } from "../entities/farm.entity";
import { Type } from "class-transformer";

export class FindAllFarmResponseDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty({ type: FarmEntity, isArray: true })
  @Type(() => FarmEntity)
  data: FarmEntity[];
}