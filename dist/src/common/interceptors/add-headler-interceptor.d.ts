import { NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
export declare class AddHeadlerInterceptor implements NestInterceptor {
    intercept(context: any, next: any): Observable<any> | Promise<Observable<any>>;
}
