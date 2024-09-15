import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const GetBaseUrl = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest<Request>();
        return `${req.protocol}://${req.get('Host')}`;
    },
);
