import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from './entity/UserEntity.js';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.PG_URL,
  synchronize: true,
  logging: process.env.NODE_ENV === 'production' ? false : true,
  entities: [UserEntity],
  subscribers: [],
  migrations: [],
  namingStrategy: new SnakeNamingStrategy()
});
