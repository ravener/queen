import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.PG_URL,
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: []
});
