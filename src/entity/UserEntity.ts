import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ length: 19 })
  id!: string;

  @Column()
  quaverId!: number;
}
