import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCropDto {
  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Soja',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da cultura é obrigatório' })
  @Length(2, 100, {
    message: 'O nome da cultura deve ter entre 2 e 100 caracteres',
  })
  name: string;
}