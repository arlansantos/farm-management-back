import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Put,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProducerEntity } from './entities/producer.entity';
import { PaginationQuery } from 'src/decorators/pagination-query.decorator';
import { PageDto } from 'src/utils/dto/page.dto';
import { IPaginateResult } from 'src/utils/helpers/paginate-result.interface';
import { FindAllProducerResponseDto } from './dto/find-all-producer-response.dto';

@ApiTags('producer')
@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar um novo produtor',
  })
  @ApiResponse({
    status: 201,
    description: 'Produtor criado com sucesso',
    type: ProducerEntity,
  })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  async create(
    @Body() createProducerDto: CreateProducerDto,
    @Request() req,
  ): Promise<ProducerEntity> {
    const traceId = req.traceId;
    return await this.producerService.create(createProducerDto, traceId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar Produtores',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtores listados com sucesso',
    type: FindAllProducerResponseDto,
  })
  @PaginationQuery()
  async findAll(@Query() pageDto: PageDto, @Request() req): Promise<IPaginateResult<ProducerEntity>> {
    const traceId = req.traceId;
    return await this.producerService.findAll(pageDto, traceId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar Produtor por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtor encontrado com sucesso',
    type: ProducerEntity,
  })
  @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<ProducerEntity> {
    const traceId = req.traceId;
    return await this.producerService.findOne(id, traceId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar Produtor',
  })
  @ApiResponse({
    status: 200,
    description: 'Produtor atualizado com sucesso',
    type: ProducerEntity,
  })
  @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProducerDto: UpdateProducerDto,
    @Request() req,
  ): Promise<ProducerEntity> {
    const traceId = req.traceId;
    return await this.producerService.update(id, updateProducerDto, traceId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remover Produtor',
  })
  @ApiResponse({
    status: 204,
    description: 'Produtor removido com sucesso',
  })
  @ApiResponse({ status: 400, description: 'ID inválido (não é um UUID)' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<void> {
    const traceId = req.traceId;
    await this.producerService.remove(id, traceId);
  }
}
