import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmEntity } from './entities/farm.entity';
import { ProducerModule } from '../producer/producer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FarmEntity]),
    ProducerModule,
  ],
  controllers: [FarmController],
  providers: [FarmService],
})
export class FarmModule {}
