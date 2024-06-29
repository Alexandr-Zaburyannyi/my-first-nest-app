import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    if (process.env.NODE_ENV !== 'production') {
      return {
        type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
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
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      migrationsRun: true,
      keepConnectionAlive: true,
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
}
