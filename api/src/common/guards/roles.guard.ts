import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/enums/auxi.enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: ActiveUserInterface } = context.switchToHttp().getRequest();
    
    return requiredRoles.some((role) => user.role === role);
  }
}
