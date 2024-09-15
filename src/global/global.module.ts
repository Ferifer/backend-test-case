import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        PassportModule.registerAsync({
            useFactory: () => ({
                defaultStrategy: 'jwt',
                property: 'user',
            }),
        }),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get('JWT_SECRET') ?? 'secret',
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES') ?? '20h',
                    },
                };
            },
        }),
    ],
})
export class GlobalModule {}
