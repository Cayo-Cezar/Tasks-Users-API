import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // captura qualquer tipo de exceção (não só HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('ApiExceptionFilter: Passando pela filter de exceção');

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    // Estrutura base da resposta de erro
    const baseErrorResponse: Record<string, any> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    let errorResponse: Record<string, any> = { ...baseErrorResponse };

    // Se for uma HttpException, extrai status e corpo corretamente
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
        statusCode: status, // garante que o statusCode reflita o status HTTP
      };
    } else {
      // Erros não tratados / genéricos
      errorResponse = {
        ...baseErrorResponse,
        message: 'Internal server error',
      };

      // Opcional: em ambiente de desenvolvimento, incluir mais detalhes
      if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
        errorResponse.errorName = exception.name;
        errorResponse.stack = exception.stack;
      }
    }

    // Opcional: logar o erro
    // console.error(exception);

    response.status(status).json(errorResponse);
  }
}
