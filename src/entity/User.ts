import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({ length: 19 })
  id!: string;

  @Column({ name: 'quaver_id', length: 9 })
  quaverID!: string;
}
