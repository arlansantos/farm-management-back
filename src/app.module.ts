import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraceInterceptor } from './interceptors/trace.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProducerModule } from './modules/producer/producer.module';
import { ProducerEntity } from './modules/producer/entities/producer.entity';
import { FarmModule } from './modules/farm/farm.module';
import { FarmEntity } from './modules/farm/entities/farm.entity';
import { CropModule } from './modules/crop/crop.module';
import { CropEntity } from './modules/crop/entities/crop.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [ProducerEntity, FarmEntity, CropEntity],
      synchronize: true,
    }),
    ProducerModule,
    FarmModule,
    CropModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceInterceptor,
    },
  ],
})
export class AppModule {}
