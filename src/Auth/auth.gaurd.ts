import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.role = 'admin';  // This would be set by your actual authentication logic (e.g., JWT)
    request.userId = 9;
    return true;
  }
}
