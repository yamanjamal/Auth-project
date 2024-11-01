import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { HashingService } from '../hashing/hashing.service';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserDate } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
  ) {}

  async signIn(dto: SignInDto) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (!user) throw new UnauthorizedException('User does not exist');

      const checkPassword = await this.hashingService.compare(
        dto.password,
        user.password,
      );

      if (!checkPassword)
        throw new UnauthorizedException('Password is not correct');

      //TODO: add tokens
      return await this.generateTokens(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async refreshTokens(dto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserDate, 'sub'>
      >(dto.refreshToken, {
        secret: this.jwtConfigration.secret,
        audience: this.jwtConfigration.audience,
        issuer: this.jwtConfigration.issuer,
      });
      const user = await this.prismaService.user.findFirstOrThrow({
        where: {
          id: sub,
        },
      });
      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async signUp(dto: SignUpDto) {
    try {
      const user = this.prismaService.user.create({
        data: {
          email: dto.email,
          password: await this.hashingService.hash(dto.password),
          first_name: dto.first_name,
        },
      });

      return user;
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserDate>>(
        user.id,
        this.jwtConfigration.accessTokenTtl,
        { email: user.email },
      ),
      this.signToken<Partial<ActiveUserDate>>(
        user.id,
        this.jwtConfigration.refreshTokenTtl,
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfigration.secret,
        audience: this.jwtConfigration.audience,
        issuer: this.jwtConfigration.issuer,
        expiresIn,
      },
    );
  }
}
