import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeysService } from '../../api-keys.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { ActiveUserDate } from 'src/iam/interfaces/active-user-data.interface';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = this.extractKeyFromHeader(request);
    if (!apiKey) throw new UnauthorizedException();
    const apiKeyId = this.apiKeysService.extractIdFromApiKey(apiKey);
    try {
      const existingApiKey = await this.prismaService.apiKey.findFirst({
        where: {
          uuid: apiKeyId,
        },
        include: {
          user: {
            include: {
              role: {
                include: { permissions: true },
              },
            },
          },
        },
      });

      await this.apiKeysService.validate(apiKey, existingApiKey.key);

      request[REQUEST_USER_KEY] = {
        sub: existingApiKey.user.id,
        role: {
          id: existingApiKey.user.role.id,
          name: existingApiKey.user.role.name,
          permissions: existingApiKey.user.role.permissions,
        },
      } as ActiveUserDate;
    } catch (err) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractKeyFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'ApiKey' ? token : undefined;
  }
}
