import { Entity, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export default class Contact {
  @ApiProperty()
  @Column({ nullable: false })
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  department: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  telephoneNo: string;

  @ApiProperty()
  @Column()
  mobileNo: string;
}
