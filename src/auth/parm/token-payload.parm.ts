import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../common/auth.constants';

export const tokenPayloadParm = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[REQUEST_TOKEN_PAYLOAD_KEY];
  },
);
