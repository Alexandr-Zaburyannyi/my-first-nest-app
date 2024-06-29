import { DataSource, DataSourceOptions } from 'typeorm';

export const appDataSource = new DataSource({
  type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
  database: 'db.sqlite',
  entities: ['**/*.entity*{.js,.ts}'],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
} as DataSourceOptions);
