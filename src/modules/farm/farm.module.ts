import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmEntity } from './entities/farm.entity';
import { ProducerModule } from '../producer/producer.module';
import { CropModule } from '../crop/crop.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FarmEntity]),
    ProducerModule,
    CropModule,
  ],
  controllers: [FarmController],
  providers: [FarmService],
})
export class FarmModule {}
