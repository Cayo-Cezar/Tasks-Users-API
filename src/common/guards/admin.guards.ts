import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
@Injectable()
export class AuthAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    console.log('AuthAdminGuard: Verificando acesso de administrador');
    console.log(request['user']);
    if (request['user']?.role == 'admin') return true;

    return false;
  }
}