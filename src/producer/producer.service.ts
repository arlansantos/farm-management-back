import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerEntity } from './entities/producer.entity';
import { Repository } from 'typeorm';

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

  async findAll(traceId: string): Promise<ProducerEntity[]> {
    this.logger.log(`[${traceId}] Listando produtores...`);
    return await this.producerRepository.find();
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
