import { Controller, Get, Post, Body, Put, Param, Delete, Request, Query, ParseUUIDPipe } from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FarmEntity } from './entities/farm.entity';
import { PaginationQuery } from 'src/decorators/pagination-query.decorator';
import { IPaginateResult } from 'src/utils/helpers/paginate-result.interface';
import { PageDto } from 'src/utils/dto/page.dto';
import { FindAllFarmResponseDto } from './dto/find-all-farm-response.dto';

@ApiTags('farm')
@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
    @ApiOperation({
      summary: 'Cadastrar uma nova fazenda',
    })
    @ApiResponse({
      status: 201,
      description: 'Fazenda criada com sucesso',
      type: FarmEntity,
    })
    @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
    async create(
      @Body() createFarmDto: CreateFarmDto,
      @Request() req,
    ): Promise<FarmEntity> {
      const traceId = req.traceId;
      return await this.farmService.create(createFarmDto, traceId);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar Fazendas',
    })
    @ApiResponse({
      status: 200,
      description: 'Fazendas listados com sucesso',
      type: FindAllFarmResponseDto,
    })
    @PaginationQuery()
    async findAll(@Query() pageDto: PageDto, @Request() req): Promise<IPaginateResult<FarmEntity>> {
      const traceId = req.traceId;
      return await this.farmService.findAll(pageDto, traceId);
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'Buscar Fazenda por ID',
    })
    @ApiResponse({
      status: 200,
      description: 'Fazenda encontrada com sucesso',
      type: FarmEntity,
    })
    @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
    @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
    async findOne(
      @Param('id', ParseUUIDPipe) id: string,
      @Request() req,
    ): Promise<FarmEntity> {
      const traceId = req.traceId;
      return await this.farmService.findOne(id, traceId);
    }
  
    @Put(':id')
    @ApiOperation({
      summary: 'Atualizar Fazenda',
    })
    @ApiResponse({
      status: 200,
      description: 'Fazenda atualizada com sucesso',
      type: FarmEntity,
    })
    @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
    @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
    @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
    async update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateFarmDto: UpdateFarmDto,
      @Request() req,
    ): Promise<FarmEntity> {
      const traceId = req.traceId;
      return await this.farmService.update(id, updateFarmDto, traceId);
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Remover Fazenda',
    })
    @ApiResponse({
      status: 204,
      description: 'Fazenda removida com sucesso',
    })
    @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
    @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
    async remove(
      @Param('id', ParseUUIDPipe) id: string,
      @Request() req,
    ): Promise<void> {
      const traceId = req.traceId;
      await this.farmService.remove(id, traceId);
    }
}
