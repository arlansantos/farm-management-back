import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateFarmDto {
  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda BH',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome da fazenda é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Área total da fazenda em hectares',
    example: 100.5,
  })
  @IsNumber({}, { message: 'A área total deve ser um número' })
  @IsPositive({ message: 'A área total deve ser maior que zero' })
  totalArea: number;

  @ApiProperty({
    description: 'Área agricultável da fazenda em hectares',
    example: 70.2,
  })
  @IsNumber({}, { message: 'A área agricultável deve ser um número' })
  @IsPositive({ message: 'A área agricultável deve ser maior que zero' })
  arableArea: number;

  @ApiProperty({
    description: 'Área de vegetação da fazenda em hectares',
    example: 30.3,
  })
  @IsNumber({}, { message: 'A área de vegetação deve ser um número' })
  @IsPositive({ message: 'A área de vegetação deve ser maior que zero' })
  vegetationArea: number;

  @ApiProperty({
    description: 'ID do produtor dono da fazenda',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'ID do produtor inválido' })
  producerId: string;
}