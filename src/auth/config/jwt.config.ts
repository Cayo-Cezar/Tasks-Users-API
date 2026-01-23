import { registerAs } from '@nestjs/config';
import type { StringValue } from 'ms';

export default registerAs('jwtConfig', () => ({
  secret: process.env.JWT_SECRET,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  jwtTtl: process.env.JWT_TTL as StringValue | undefined, // <- aqui
}));
