import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticationService } from '../authentication.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oAuth2Client: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
    private readonly prismaService: PrismaService,
  ) {}

  onModuleInit() {
    const clientId = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.oAuth2Client = new OAuth2Client(clientId, clientSecret);
  }

  async authenticate(token: string) {
    try {
      const loginTicket = await this.oAuth2Client.verifyIdToken({
        idToken: token,
      });
      const { email, sub: googleId } = loginTicket.getPayload();

      const user = await this.prismaService.user.findFirst({
        where: {
          googleId,
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });
      if (!user) {
        return await this.authenticationService.generateTokens(user);
      } else {
        const newUser = await this.prismaService.user.create({
          data: {
            email,
            googleId,
            first_name: 'hey',
            roleId: 2,
          },
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        });
        return await this.authenticationService.generateTokens(newUser);
      }
    } catch (err) {
      throw new ConflictException();
    }
  }
}
