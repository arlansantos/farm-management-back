import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmEntity } from './entities/farm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FarmEntity])],
  controllers: [FarmController],
  providers: [FarmService],
})
export class FarmModule {}
