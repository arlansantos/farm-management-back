import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
    example: '7e48ac88-ee8d-4399-8c03-1ddfa5557527',
  })
  @IsUUID(4, { message: 'ID do produtor inválido' })
  producerId: string;

  @ApiPropertyOptional({
    description: 'ID dos cultivos associados à fazenda',
    example: ['8c731c13-2985-4375-813c-7e49855fc160'],
  })
  @IsUUID(4, {each: true, message: 'ID de cultivo inválido' })
  @IsOptional()
  cropIds?: string[];
}