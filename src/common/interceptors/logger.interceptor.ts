import { ExecutionContext, NestInterceptor, CallHandler, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();
    console.log(`[REQUEST] ${method} ${url} - ${new Date().toISOString()}`);

    return next
      .handle()
      .pipe(
        tap(() => console.log(`[RESPONSE] ${method} ${url} - ${new Date().toISOString()} - ${Date.now() - now}ms`))
      );
  }
}