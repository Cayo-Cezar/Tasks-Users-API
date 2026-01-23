import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    const baseErrorResponse: Record<string, any> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    let errorResponse: Record<string, any> = { ...baseErrorResponse };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const normalizedResponse =
        typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : (exceptionResponse as Record<string, any>);

      errorResponse = {
        ...baseErrorResponse,
        ...normalizedResponse,
        statusCode: status,
      };
    } else {
      errorResponse = {
        ...baseErrorResponse,
        message: 'Internal server error',
      };

      if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
        errorResponse.errorName = exception.name;
        errorResponse.stack = exception.stack;
      }
    }

    response.status(status).json(errorResponse);
  }
}
