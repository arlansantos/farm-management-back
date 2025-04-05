import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FarmEntity } from 'src/modules/farm/entities/farm.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('producers')
export class ProducerEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiPropertyOptional()
  @Column({ nullable: true, length: 11 })
  cpf?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true, length: 14 })
  cnpj?: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  email?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty()
  @Column({ name: 'bith_date', type: 'date' })
  birthDate: Date;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => FarmEntity, farm => farm.producer)
  farms: FarmEntity[];
}
