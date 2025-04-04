import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ProducerEntity } from "../entities/producer.entity";

export class FindAllProducerResponseDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty({ type: ProducerEntity, isArray: true })
  @Type(() => ProducerEntity)
  data: ProducerEntity[];
}