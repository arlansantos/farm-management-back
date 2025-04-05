import { Controller, Get, Post, Body, Put, Param, Delete, Request, Query, ParseUUIDPipe, Patch } from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FarmEntity } from './entities/farm.entity';
import { PaginationQuery } from 'src/decorators/pagination-query.decorator';
import { IPaginateResult } from 'src/utils/helpers/paginate-result.interface';
import { PageDto } from 'src/utils/dto/page.dto';
import { FindAllFarmResponseDto } from './dto/find-all-farm-response.dto';
import { AddCropsDto } from './dto/add-crops.dto';
import { RemoveCropsDto } from './dto/remove-crops.dto';

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
      summary: 'Listar fazendas',
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

    @Get('/total-farms')
    @ApiOperation({ summary: 'Obter total de fazendas' })
    @ApiResponse({ status: 200, description: 'Total de fazendas ', type: Number })
    async getTotalFarms(@Request() req): Promise<number> {
      const traceId = req.traceId;
      return await this.farmService.getTotalFarms(traceId);
    }

    @Get('/total-area')
    @ApiOperation({ summary: 'Obter total de área em hectares' })
    @ApiResponse({ status: 200, description: 'Total de área em hectares' })
    async getTotalArea(@Request() req) {
      const traceId = req.traceId;
      return await this.farmService.getTotalArea(traceId);
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'Buscar fazenda por ID',
    })
    @ApiParam({ name: 'id', description: 'ID da fazenda' })
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
      summary: 'Atualizar fazenda',
    })
    @ApiParam({ name: 'id', description: 'ID da fazenda' })
    @ApiResponse({
      status: 200,
      description: 'Fazenda atualizada com sucesso',
      type: FarmEntity,
    })
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

    @Patch(':id/crops')
    @ApiOperation({
      summary: 'Adicionar culturas de plantações',
    })
    @ApiParam({ name: 'id', description: 'ID da fazenda' })
    @ApiResponse({
      status: 200,
      description: 'Plantações adicionadas à fazenda com sucesso',
    })
    @ApiResponse({ status: 400, description: 'ID inválido | A(s) cultura(s) já está(ão) vinculada(s) à fazenda' })
    @ApiResponse({ status: 404, description: 'Fazenda não encontrada | Nenhuma cultura de plantação encontrada' })
    async addCropsToFarm(
      @Param('id', ParseUUIDPipe) farmId: string,
      @Body() addCropsDto: AddCropsDto,
      @Request() req,
    ) {
      const traceId = req.traceId;
      return this.farmService.addCropsToFarm(farmId, addCropsDto, traceId);
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Remover fazenda',
    })
    @ApiParam({ name: 'id', description: 'ID da fazenda' })
    @ApiResponse({
      status: 204,
      description: 'Fazenda removida com sucesso',
    })
    @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
    @ApiResponse({ status: 404, description: 'Fazenda não encontrada | Nenhuma das culturas informadas está associada a esta fazenda' })
    async remove(
      @Param('id', ParseUUIDPipe) id: string,
      @Request() req,
    ): Promise<void> {
      const traceId = req.traceId;
      await this.farmService.remove(id, traceId);
    }

  @Delete(':id/crops')
  @ApiOperation({ summary: 'Remover associação de culturas de uma fazenda' })
  @ApiParam({ name: 'id', description: 'ID da fazenda' })
  @ApiResponse({ status: 200, description: 'Culturas removidas com sucesso' })
  @ApiResponse({ status: 404, description: 'Fazenda ou cultura não encontrada' })
  async removeCropsFromFarm(
    @Param('id') farmId: string,
    @Body() removeCropsDto: RemoveCropsDto,
    @Request() req,
  ): Promise<void> {
    const traceId = req.traceId;
    await this.farmService.removeCropsFromFarm(farmId, removeCropsDto, traceId);
  }
}
