import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const configService: ConfigService<EnvironmentVariables> = new ConfigService();

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: +configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'postgre',
        database: configService.get<string>('DB_NAME') || "db_backend_test_case",
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        synchronize: configService.get('DB_SYNC') === 'true',
        logging: configService.get('DB_LOGGING') === 'true' ? true : false,
        extra: {
            timezone: "Asia/Jakarta", // Set the timezone to Asia/Jakarta
          }
      });

      return dataSource.initialize();
    },
  },
];
