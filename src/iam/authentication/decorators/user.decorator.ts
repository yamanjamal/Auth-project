import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constants';
import { ProtocolEnum } from '../enums/protocol.enum';
import { ActiveUserDate } from 'src/iam/interfaces/active-user-data.interface';

export const AUTH_TYPE_KEY = 'authType';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserDate | undefined, ctx: ExecutionContext) => {
    const request =
      ctx.getType() === ProtocolEnum.WS
        ? ctx.switchToWs().getClient().handshake
        : ctx.switchToHttp().getRequest();
    const user: ActiveUserDate | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
