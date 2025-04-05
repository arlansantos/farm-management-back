import { Module } from '@nestjs/common';
import { CropService } from './crop.service';
import { CropController } from './crop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropEntity } from './entities/crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CropEntity])], 
  controllers: [CropController],
  providers: [CropService],
  exports: [CropService],
})
export class CropModule {}
