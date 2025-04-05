import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmEntity } from './entities/farm.entity';
import { PageDto } from 'src/utils/dto/page.dto';
import { IPaginateResult } from 'src/utils/helpers/paginate-result.interface';
import { paginate } from 'src/utils/helpers/paginate';
import { ProducerService } from '../producer/producer.service';
import { CropService } from '../crop/crop.service';
import { CropEntity } from '../crop/entities/crop.entity';
import { AddCropsDto } from './dto/add-crops.dto';
import { RemoveCropsDto } from './dto/remove-crops.dto';

@Injectable()
export class FarmService {
  private readonly logger = new Logger(FarmService.name);

  constructor(
    @InjectRepository(FarmEntity)
    private readonly farmRepository: Repository<FarmEntity>,
    private readonly producerService: ProducerService,
    private readonly cropService: CropService,
  ) {}

  async create(createFarmDto: CreateFarmDto, traceId: string) {
    this.logger.log(`[${traceId}] Cadastrando fazenda...`);

    this.validateArea(createFarmDto.totalArea, createFarmDto.arableArea, createFarmDto.vegetationArea, traceId);

    const producer = await this.producerService.findOne(createFarmDto.producerId, traceId);

    let crops: CropEntity[] = [];

    if (createFarmDto.cropIds && createFarmDto.cropIds.length > 0) {
      crops = await this.cropService.findAllByIds(createFarmDto.cropIds, traceId);
    }
    
    const farm = this.farmRepository.create({
      ...createFarmDto,
      producer,
      crops,
    });

    const savedFarm = await this.farmRepository.save(farm);

    this.logger.log(
      `[${traceId}] Fazenda cadastrada: ${JSON.stringify(savedFarm)}`,
    );

    return savedFarm;
  }

  async findAll(pageDto: PageDto, traceId: string): Promise<IPaginateResult<FarmEntity>> {
    this.logger.log(`[${traceId}] Listando fazendas...`);

    const queryBuilder = this.farmRepository.createQueryBuilder('farm')
      .leftJoinAndSelect('farm.producer', 'producer')
      .leftJoinAndSelect('farm.crops', 'crops')
      .select([
        'farm',
        'producer.id',
        'producer.name',
        'crops.id',
        'crops.name',
      ]);
    ;

    return await paginate( queryBuilder, 'farm', pageDto);
  }

  async findOne(id: string, traceId: string): Promise<FarmEntity> {
    this.logger.log(`[${traceId}] Buscando fazenda com ID ${id}...`);

    const farm = await this.farmRepository.findOne({ 
      where: { id },
      relations: ['producer', 'crops'],
    });

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

    Object.assign(farm, {
      name: updateFarmDto.name ?? farm.name,
      totalArea: updateFarmDto.totalArea ?? farm.totalArea,
      arableArea: updateFarmDto.arableArea ?? farm.arableArea,
      vegetationArea: updateFarmDto.vegetationArea ?? farm.vegetationArea,
    });    

    this.validateArea(
      farm.totalArea,
      farm.arableArea,
      farm.vegetationArea,
      traceId,
    );

    if (updateFarmDto.producerId) {
      const producer = await this.producerService.findOne(
        updateFarmDto.producerId,
        traceId,
      );

      farm.producer = producer;
    }

    const updatedFarm = await this.farmRepository.save(farm);

    this.logger.log(
      `[${traceId}] Fazenda com ID ${id} atualizada.`,
    );

    return updatedFarm;
  }

  async addCropsToFarm(farmId: string, addCropsDto: AddCropsDto, traceId: string) {
    this.logger.log(`[${traceId}] Adicionando culturas de plantações à fazenda com ID ${farmId}...`);
    
    const farm = await this.findOne(farmId, traceId);

    // Filtra as novas culturas que ainda não estão associadas à fazenda
    const existingCropIds = farm.crops.map(crop => crop.id);
    const newCropIds = addCropsDto.cropIds.filter(id => !existingCropIds.includes(id));
    
    if (newCropIds.length === 0) {
        this.logger.warn(`[${traceId}] A(s) cultura(s) já está(ão) vinculada(s) à fazenda`);
        throw new BadRequestException(`A(s) cultura(s) já está(ão) vinculada(s) à fazenda`);
    }
    
    const cropsToAdd = await this.cropService.findAllByIds(newCropIds, traceId);

    farm.crops = [...farm.crops, ...cropsToAdd];
    
    this.logger.log(`[${traceId}] ${cropsToAdd.length} culturas de plantações adicionadas`);

    return await this.farmRepository.save(farm);
  }

  async remove(id: string, traceId: string): Promise<void> {
    this.logger.log(`[${traceId}] Removendo fazenda com ID ${id}...`);

    const farm = await this.findOne(id, traceId);

    await this.farmRepository.remove(farm);

    this.logger.log(`[${traceId}] Fazenda com ID ${id} removida.`);
  }

  async removeCropsFromFarm(farmId: string, removeCropsDto: RemoveCropsDto, traceId: string): Promise<void> {
    this.logger.log(`[${traceId}] Removendo culturas de plantações da fazenda com ID ${farmId}...`);

    const farm = await this.findOne(farmId, traceId);
    const initialCountCrops = farm.crops.length;
    
    // Verifica se as culturas a serem removidas estão associadas à fazenda
    const cropsToRemove = removeCropsDto.cropIds;
    farm.crops = farm.crops.filter(crop => !cropsToRemove.includes(crop.id));

    if (farm.crops.length === initialCountCrops) {
      this.logger.warn(`[${traceId}] Nenhuma das culturas informadas está associada a esta fazenda`);
      throw new BadRequestException('Nenhuma das culturas informadas está associada a esta fazenda');
  }

    await this.farmRepository.save(farm); 
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
