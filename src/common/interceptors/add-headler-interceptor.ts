import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AddHeadlerInterceptor implements NestInterceptor {
  intercept(context: any, next: any): Observable<any> | Promise<Observable<any>> {

    const response = context.switchToHttp().getResponse();

    response.setHeader('X-Custom', 'valor chave 123');
    return next.handle();
  }
}