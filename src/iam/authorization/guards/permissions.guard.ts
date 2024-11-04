import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ActiveUserDate } from 'src/iam/interfaces/active-user-data.interface';
import { ProtocolEnum } from 'src/iam/authentication/enums/protocol.enum';
import { REQUEST_USER_KEY } from 'src/iam/authentication/iam.constants';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';
import { PermissionType } from '../permission.type';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<any> {
    const ctxPermissions = this.reflector.getAllAndOverride<PermissionType[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!ctxPermissions) return true;
    const user: ActiveUserDate =
      context.getType() === ProtocolEnum.WS
        ? context.switchToWs().getClient().handshake[REQUEST_USER_KEY]
        : context.switchToHttp().getRequest()[REQUEST_USER_KEY];

    const permissionNames = user.role.permissions.map((pn) => pn.name);

    return ctxPermissions.every((permission) =>
      permissionNames.includes(permission),
    );
  }
}
