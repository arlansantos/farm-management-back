import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { CropEntity } from './entities/crop.entity';
import { paginate } from 'src/utils/helpers/paginate';
import { PageDto } from 'src/utils/dto/page.dto';
import { IPaginateResult } from 'src/utils/helpers/paginate-result.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CropService {
  private readonly logger = new Logger(CropService.name);

  constructor(
    @InjectRepository(CropEntity)
    private readonly cropRepository: Repository<CropEntity>,
  ) {}

  async create(createCropDto: CreateCropDto, traceId: string) {
    this.logger.log(`[${traceId}] Criando plantação...`);

    const crop = await this.cropRepository.save(createCropDto);

    this.logger.log(
      `[${traceId}] Plantação criada: ${JSON.stringify(crop)}`,
    );

    return crop;
  }

  async findAll(pageDto: PageDto, traceId: string): Promise<IPaginateResult<CropEntity>> {
    this.logger.log(`[${traceId}] Listando plantações...`);

    const queryBuilder = this.cropRepository.createQueryBuilder('crop');

    return await paginate( queryBuilder, 'crop', pageDto);
  }

  async findAllByIds(ids: string[], traceId: string): Promise<CropEntity[]> {
    this.logger.log(`[${traceId}] Buscando plantações por IDs...`);

    const crops = await this.cropRepository
    .createQueryBuilder('crop')
    .where('crop.id IN (:...ids)', { ids })
    .getMany();
  
    if (crops.length === 0) {
      this.logger.warn(`[${traceId}] Nenhuma plantação encontrada com os IDs fornecidos.`);
      throw new NotFoundException(`Nenhuma plantação encontrada com os IDs fornecidos.`);
    }

    return crops;
  }

  async findOne(id: string, traceId: string): Promise<CropEntity> {
    this.logger.log(`[${traceId}] Buscando plantação com ID ${id}...`);

    const crop = await this.cropRepository.findOne({ where: { id } });

    if (!crop) {
      this.logger.warn(`[${traceId}] Plantação com ID ${id} não encontrada.`);
      throw new NotFoundException(`Plantação com ID ${id} não encontrada.`);
    }

    return crop;
  }

  async update(
    id: string,
    updateCropDto: UpdateCropDto,
    traceId: string,
  ): Promise<CropEntity> {
    this.logger.log(`[${traceId}] Atualizando plantação com ID ${id}...`);

    await this.findOne(id, traceId);

    await this.cropRepository.update(id, updateCropDto);

    this.logger.log(
      `[${traceId}] Plantação com ID ${id} atualizada.`,
    );

    return await this.findOne(id, traceId);
  }

  async remove(id: string, traceId: string): Promise<void> {
    this.logger.log(`[${traceId}] Removendo plantação com ID ${id}...`);

    const crop = await this.findOne(id, traceId);

    await this.cropRepository.remove(crop);

    this.logger.log(`[${traceId}] Plantação com ID ${id} removida.`);
  }

}