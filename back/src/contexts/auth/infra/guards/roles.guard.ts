import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!roles || roles.length === 0) return true;

        const request = context.switchToHttp().getRequest<{ user?: { roles?: string[] } }>();
        const userRoles = request.user?.roles ?? [];
        const hasRole = roles.some((role) => userRoles.includes(role));
        if (!hasRole) throw new ForbiddenException('No tienes permisos para esta operación');
        return true;
    }
}

export default RolesGuard;
