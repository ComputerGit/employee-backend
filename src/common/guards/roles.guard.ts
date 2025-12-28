import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, IS_PUBLIC_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // First priority: Check if the route is marked as public
    // If it is, we skip all authentication and authorization checks entirely
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // Route is public, allow access immediately without any session checks
      return true;
    }

    // Second priority: Check what roles are required for this endpoint
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context.switchToHttp().getRequest();

    // If no specific roles are required, just check if user is authenticated
    // This means the route is protected but doesn't require specific roles
    if (!requiredRoles || requiredRoles.length === 0) {
      // User must have a session to access protected routes
      return !!req.session?.user;
    }

    // If we reach here, specific roles are required
    // First verify the user is authenticated
    if (!req.session?.user) {
      return false;
    }

    // Then verify they have one of the required roles
    return requiredRoles.includes(req.session.user.role);
  }
}
