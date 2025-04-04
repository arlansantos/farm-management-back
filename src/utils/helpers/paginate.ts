import { HttpException, HttpStatus } from "@nestjs/common";
import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { PageDto } from "../dto/page.dto";
import { IPaginateResult } from "./paginate-result.interface";

export async function paginate<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  entityAlias: string,
  pageDto: PageDto
): Promise<IPaginateResult<T>> {

  const page = Math.max(pageDto.page || 1, 1);
  const limit = Math.max(pageDto.limit || 20, 1);
  const orderBy = pageDto.orderBy ? `${entityAlias}.${pageDto.orderBy}` : `${entityAlias}.id`;
  const orderDirection = pageDto.orderDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const [data, totalItems] = await query
    .orderBy(orderBy, orderDirection)
    .take(limit)
    .skip((page - 1) * limit)
    .getManyAndCount();

  if (!data.length) {
    throw new HttpException('', HttpStatus.NO_CONTENT);
  }

  return {
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
    data,
  };
}