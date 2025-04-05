import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmEntity } from './entities/farm.entity';
import { PageDto } from 'src/utils/dto/page.dto';
import { IPaginateResult } from 'src/utils/helpers/paginate-result.interface';
import { paginate } from 'src/utils/helpers/paginate';

@Injectable()
export class FarmService {
  private readonly logger = new Logger(FarmService.name);

  constructor(
    @InjectRepository(FarmEntity)
    private readonly farmRepository: Repository<FarmEntity>,
  ) {}

  async create(createFarmDto: CreateFarmDto, traceId: string) {
    this.logger.log(`[${traceId}] Cadastrando fazenda...`);

    this.validateArea(createFarmDto.totalArea, createFarmDto.arableArea, createFarmDto.vegetationArea, traceId);

    const farm = await this.farmRepository.save(createFarmDto);

    this.logger.log(
      `[${traceId}] Fazenda cadastrada: ${JSON.stringify(farm)}`,
    );

    return farm;
  }

  async findAll(pageDto: PageDto, traceId: string): Promise<IPaginateResult<FarmEntity>> {
    this.logger.log(`[${traceId}] Listando fazendas...`);

    const queryBuilder = this.farmRepository.createQueryBuilder('farm');

    return await paginate( queryBuilder, 'farm', pageDto);
  }

  async findOne(id: string, traceId: string): Promise<FarmEntity> {
    this.logger.log(`[${traceId}] Buscando fazenda com ID ${id}...`);

    const farm = await this.farmRepository.findOne({ where: { id } });

    if (!farm) {
      this.logger.warn(`[${traceId}] Fazenda com ID ${id} não encontrada.`);
      throw new NotFoundException(`Fazenda com ID ${id} não encontrada.`);
    }

    return farm;
  }

  async update(
    id: string,
    updateFarmDto: UpdateFarmDto,
    traceId: string,
  ): Promise<FarmEntity> {
    this.logger.log(`[${traceId}] Atualizando fazenda com ID ${id}...`);

    const farm = await this.findOne(id, traceId);

    farm.totalArea = updateFarmDto.totalArea ?? farm.totalArea;
    farm.arableArea = updateFarmDto.arableArea ?? farm.arableArea;
    farm.vegetationArea = updateFarmDto.vegetationArea ?? farm.vegetationArea;

    this.validateArea(
      farm.totalArea,
      farm.arableArea,
      farm.vegetationArea,
      traceId,
    );

    await this.farmRepository.update(id, updateFarmDto);

    this.logger.log(
      `[${traceId}] Fazenda atualizada: ${JSON.stringify(farm)}`,
    );

    return await this.findOne(id, traceId);
  }

  async remove(id: string, traceId: string): Promise<void> {
    this.logger.log(`[${traceId}] Removendo fazenda com ID ${id}...`);

    const farm = await this.findOne(id, traceId);

    await this.farmRepository.remove(farm);

    this.logger.log(`[${traceId}] Fazenda com ID ${id} removida.`);
  }

  private validateArea(
    totalArea: number,
    arableArea: number,
    vegetationArea: number,
    traceId: string,
  ): void {
    this.logger.log(`[${traceId}] Validando área da fazenda...`);

    const validArea = totalArea >= arableArea + vegetationArea;

    if (!validArea) {
      this.logger.warn(`[${traceId}] A soma das áreas agricultável e de vegetação não pode ser maior que a área total.`);
      throw new BadRequestException(`A soma das áreas agricultável e de vegetação não pode ser maior que a área total.`);
    }
  }
}
