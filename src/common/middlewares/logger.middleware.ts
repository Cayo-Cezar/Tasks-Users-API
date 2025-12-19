import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {

    const authorizarization = req.headers.authorization
    if (authorizarization) {
      req['user'] = { token: authorizarization, role: 'admin' };
    }

    next();
  }
}