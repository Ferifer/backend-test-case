import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtTokenStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(ConfigService)
        private readonly config: ConfigService,
        @Inject(JwtService)
        private readonly jwtService: JwtService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        });
    }

    async validate(payload: string): Promise<any> {
        return this.jwtService.verifyAsync(payload);
    }
}
