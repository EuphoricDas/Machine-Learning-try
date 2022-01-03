import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class ChangeTracking {
  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdOn', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdOn: Date;

  @Column({ name: 'createdBy', type: 'int8', nullable:true })
  createdBy: number;

  @UpdateDateColumn({ name: 'updatedOn', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedOn: Date;

  @Column({ name: 'updatedBy', type: 'int8', nullable:true })
  updatedBy: number;
}
