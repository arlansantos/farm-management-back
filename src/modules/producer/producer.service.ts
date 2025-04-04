import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerEntity } from './entities/producer.entity';
import { Repository } from 'typeorm';
import { PageDto } from 'src/utils/dto/page.dto';
import { paginate } from 'src/utils/helpers/paginate';
import { IPaginateResult } from 'src/utils/helpers/paginate-result.interface';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);

  constructor(
    @InjectRepository(ProducerEntity)
    private readonly producerRepository: Repository<ProducerEntity>,
  ) {}

  async create(createProducerDto: CreateProducerDto, traceId: string) {
    this.logger.log(`[${traceId}] Criando produtor...`);

    const producer = await this.producerRepository.save(createProducerDto);

    this.logger.log(
      `[${traceId}] Produtor criado: ${JSON.stringify(producer)}`,
    );

    return producer;
  }

  async findAll(pageDto: PageDto, traceId: string): Promise<IPaginateResult<ProducerEntity>> {
    this.logger.log(`[${traceId}] Listando produtores...`);

    const queryBuilder = this.producerRepository.createQueryBuilder('producer');

    return await paginate( queryBuilder, 'producer', pageDto);
  }

  async findOne(id: string, traceId: string): Promise<ProducerEntity> {
    this.logger.log(`[${traceId}] Buscando produtor com ID ${id}...`);

    const producer = await this.producerRepository.findOne({ where: { id } });

    if (!producer) {
      this.logger.warn(`[${traceId}] Produtor com ID ${id} não encontrado.`);
      throw new NotFoundException(`Produtor com ID ${id} não encontrado.`);
    }

    return producer;
  }

  async update(
    id: string,
    updateProducerDto: UpdateProducerDto,
    traceId: string,
  ): Promise<ProducerEntity> {
    this.logger.log(`[${traceId}] Atualizando produtor com ID ${id}...`);

    const producer = await this.findOne(id, traceId);

    await this.producerRepository.update(id, updateProducerDto);

    this.logger.log(
      `[${traceId}] Produtor atualizado: ${JSON.stringify(producer)}`,
    );

    return await this.findOne(id, traceId);
  }

  async remove(id: string, traceId): Promise<void> {
    this.logger.log(`[${traceId}] Removendo produtor com ID ${id}...`);

    const producer = await this.findOne(id, traceId);

    await this.producerRepository.remove(producer);

    this.logger.log(`[${traceId}] Produtor com ID ${id} removido.`);
  }
}
