import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { ChangeTracking } from './entity-change-tracking-cols';

export enum UserRole {
  none = 0,
  administrator = 1,
  biller = 2,
  support = 3,
  customer = 4
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'userType' } })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column()
  mobileNo: string;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  username: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.none
  })
  userRole: UserRole;

  @Column(() => ChangeTracking, { prefix: false })
  changeTracking: ChangeTracking;

  constructor(initialValues?: Partial<User>) {
    if (initialValues) {
      Object.assign(this, initialValues);
      initialValues.username = initialValues.email
      this.username = initialValues.email

      if (initialValues.password) {
        this.password = User.encryptPassword(initialValues.username, initialValues.password);
      }
    }
  }

  public static async compare(plainPassword: string, encryptedPassword: string) {
    const isMatch = await bcrypt.compare(plainPassword, encryptedPassword);

    return isMatch;
  }

  public static encryptPassword(username: string, password: string) {
    return bcrypt.hashSync(password, 10);
  }
}
