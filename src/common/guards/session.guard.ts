import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/roles.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // First, check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If it's a public route, allow access immediately
    if (isPublic) {
      return true;
    }

    // For non-public routes, check if there's a valid session
    const req = context.switchToHttp().getRequest();
    return !!req.session?.user;
  }
}
