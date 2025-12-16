import { NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
export declare class BodyCreateTaskInterceptor implements NestInterceptor {
    intercept(context: any, next: any): Observable<any> | Promise<Observable<any>>;
}
