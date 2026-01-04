import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const tokenPayloadParm = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const context = ctx.switchToHttp();
  const request: Request = context.getRequest();
  return request['REQUEST_TOKEN_PAYLOAD_KEY'];
});