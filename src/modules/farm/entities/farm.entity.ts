import { ApiProperty } from "@nestjs/swagger";
import { ProducerEntity } from "src/modules/producer/entities/producer.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('farms')
export class FarmEntity {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({name:'total_area', type: 'float' })
  totalArea: number;

  @ApiProperty()
  @Column({name: 'arable_area', type: 'float' })
  arableArea: number;

  @ApiProperty()
  @Column({name: 'vegetation_area', type: 'float' })
  vegetationArea: number;

  @ApiProperty()
  @ManyToOne(() => ProducerEntity, producer => producer.farms)
  @JoinColumn({ name: 'producer_id' })
  producer: ProducerEntity;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
