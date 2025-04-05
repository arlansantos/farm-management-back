import { Controller, Get, Post, Body, Put, Param, Delete, Request, Query, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CropEntity } from './entities/crop.entity';
import { PageDto } from 'src/utils/dto/page.dto';
import { PaginationQuery } from 'src/decorators/pagination-query.decorator';
import { IPaginateResult } from 'src/utils/helpers/paginate-result.interface';
import { FindAllCropResponseDto } from './dto/find-all-crop-response.dto';

@ApiTags('crop')
@Controller('crop')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova cultura de plantação',
  })
  @ApiResponse({
    status: 201,
    description: 'Plantação criada com sucesso',
    type: CropEntity,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  async create(
    @Body() createCropDto: CreateCropDto,
    @Request() req,
  ): Promise<CropEntity> {
    const traceId = req.traceId;
    return await this.cropService.create(createCropDto, traceId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar Plantações',
  })
  @ApiResponse({
    status: 200,
    description: 'Plantações listadas com sucesso',
    type: FindAllCropResponseDto,
  })
  @PaginationQuery()
  async findAll(@Query() pageDto: PageDto, @Request() req): Promise<IPaginateResult<CropEntity>> {
    const traceId = req.traceId;
    return await this.cropService.findAll(pageDto, traceId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar Plantação por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Plantação encontrada com sucesso',
    type: CropEntity,
  })
  @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
  @ApiResponse({ status: 404, description: 'Plantação não encontrada' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<CropEntity> {
    const traceId = req.traceId;
    return await this.cropService.findOne(id, traceId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar Plantação',
  })
  @ApiResponse({
    status: 200,
    description: 'Plantação atualizada com sucesso',
    type: CropEntity,
  })
  @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 404, description: 'Plantação não encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCropDto: UpdateCropDto,
    @Request() req,
  ): Promise<CropEntity> {
    const traceId = req.traceId;
    return await this.cropService.update(id, updateCropDto, traceId);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remover Plantação',
  })
  @ApiResponse({
    status: 204,
    description: 'Plantação removida com sucesso',
  })
  @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
  @ApiResponse({ status: 404, description: 'Plantação não encontrada' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<void> {
    const traceId = req.traceId;
    await this.cropService.remove(id, traceId);
  }
}
