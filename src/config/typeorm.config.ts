import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    if (process.env.NODE_ENV !== 'production') {
      return {
        type: 'sqlite',
        synchronize: process.env.NODE_ENV === 'test' ? true : false,
        database: this.configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        migrationsRun: process.env.NODE_ENV === 'test' ? true : false,
        keepConnectionAlive: process.env.NODE_ENV === 'test' ? true : false,
      };
    }
    return {
      type: 'postgres',
      synchronize: false,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      migrationsRun: true,
      keepConnectionAlive: true,
      port: process.env.PORT as unknown as number,
      host: process.env.HOST,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
}
