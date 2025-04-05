import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { IsCNPJ } from 'src/utils/validators/cnpj.validator';
import { IsCPF } from 'src/utils/validators/cpf.validator';

export class CreateProducerDto {
  @ApiPropertyOptional({
    description: 'CPF do produtor (somente números, 11 dígitos)',
    example: '12345678901',
  })
  @IsOptional()
  @IsString()
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  @IsCPF()
  cpf?: string;

  @ApiPropertyOptional({
    description: 'CNPJ do produtor (somente números, 14 dígitos)',
    example: '12345678000199',
  })
  @IsOptional()
  @IsString()
  @Length(14, 14, { message: 'CNPJ deve ter exatamente 14 dígitos' })
  @IsCNPJ()
  cnpj?: string;

  @ApiProperty({
    description: 'Nome completo do produtor',
    example: 'João da Silva',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'E-mail do produtor',
    example: 'joao.silva@email.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Número de telefone com DDD (formato internacional)',
    example: '+5511999999999',
  })
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Número de telefone inválido' })
  phone?: string;

  @ApiProperty({
    description: 'Data de nascimento. Formato: YYYY-MM-DD',
    example: '1980-05-15',
  })
  @IsDateString(
    {},
    { message: 'birthDate deve ser uma data válida (YYYY-MM-DD)' },
  )
  birthDate: string;
}
