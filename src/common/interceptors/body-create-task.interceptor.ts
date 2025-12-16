import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class BodyCreateTaskInterceptor implements NestInterceptor {
  intercept(context: any, next: any): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { method, url, body } = request;

    console.log(`[BODY CREATE TASK] ${method} ${url} - Body: ${JSON.stringify(body)} - ${new Date().toISOString()}`);

    return next.handle();
  }
}