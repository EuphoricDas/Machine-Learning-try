import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export default class Address {
  @ApiProperty()
  @Column({ nullable: false })
  line1: string;

  @ApiProperty()
  @Column()
  line2: string;

  @ApiProperty()
  @Column({ nullable: false })
  city: string;

  @ApiProperty()
  @Column()
  region: string;

  @ApiProperty()
  @Column()
  country: string;

  @ApiProperty()
  @Column()
  postCode: string;

  @ApiProperty()
  @Column()
  telephone: string;
}
