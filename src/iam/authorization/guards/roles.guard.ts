import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/roles/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ActiveUserDate } from 'src/iam/interfaces/active-user-data.interface';
import { ProtocolEnum } from 'src/iam/authentication/enums/protocol.enum';
import { REQUEST_USER_KEY } from 'src/iam/authentication/iam.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<any> {
    const ctxRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!ctxRoles) return true;
    const user: ActiveUserDate =
      context.getType() === ProtocolEnum.WS
        ? context.switchToWs().getClient().handshake[REQUEST_USER_KEY]
        : context.switchToHttp().getRequest()[REQUEST_USER_KEY];

    return ctxRoles.some((role) => user.role === role);
  }
}
