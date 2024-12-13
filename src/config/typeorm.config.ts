import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      ssl: null,
      port: Number(process.env.DATABASE_PORT),
      synchronize: true,
      autoLoadEntities: true,
      // dropSchema: true,
    };
  },
};

export const typeOrmConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: null,
  port: Number(process.env.DATABASE_PORT),
  synchronize: true,
  autoLoadEntities: true,
  factories: ['src/seeder/factories/**/*{.ts,.js}'],
  seeds: ['src/seeder/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
};
