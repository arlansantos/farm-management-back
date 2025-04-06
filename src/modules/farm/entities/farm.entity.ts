import { ApiProperty } from "@nestjs/swagger";
import { CropEntity } from "src/modules/crop/entities/crop.entity";
import { ProducerEntity } from "src/modules/producer/entities/producer.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
  @Column({length: 30})
  city: string;

  @ApiProperty()
  @Column({length: 2})
  uf: string;

  @ApiProperty({type: () => ProducerEntity})
  @ManyToOne(() => ProducerEntity, producer => producer.farms)
  @JoinColumn({ name: 'producer_id' })
  producer: ProducerEntity;

  @ManyToMany(() => CropEntity, crop => crop.farms, { cascade: true })
  @JoinTable({name: 'farms_crops'})
  crops: CropEntity[];

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
