import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function PaginationQuery() {
  return applyDecorators(
    ApiQuery({ 
      name: 'page',
      required: false,
      example: 1,
      description: 'Número da página',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: 10,
      description: 'Quantidade de itens por página',
    }),
    ApiQuery({
      name: 'orderBy',
      required: false,
      example: 'createdAt',
      description: 'Campo para ordenar',
    }),
    ApiQuery({
      name: 'orderDirection',
      required: false,
      example: 'DESC',
      description: 'Direção da ordenação',
    }),
  );
}
