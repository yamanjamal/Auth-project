import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUser } from './decorators/user.decorator';
import { ActiveUserDate } from '../interfaces/active-user-data.interface';
import { Response } from 'express';
import { OtpAuthenticationService } from './otp-authentication.service';
import { toFileStream } from 'qrcode';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly otpAuthenticationService: OtpAuthenticationService,
  ) {}

  @Auth(AuthType.Bearer)
  @Post('2fa/generate')
  @ApiOperation({ summary: 'Two factor authentication' })
  @ApiOkResponse({
    description: 'Two factor authentication generate end point',
    type: String,
  })
  async twofaGenerate(
    @ActiveUser() user: ActiveUserDate,
    @Res() response: Response,
  ) {
    const { uri, secret } = await this.otpAuthenticationService.generateSecret(
      user.email,
    );
    await this.otpAuthenticationService.enableTfaForUser(user.email, secret);
    response.type('png');
    return toFileStream(response, uri);
  }
  @Post('sign-in')
  @ApiOperation({ summary: 'SignIn' })
  @ApiOkResponse({
    description: 'SignIn user end point',
    type: String,
  })
  async signIn(@Body() dto: SignInDto) {
    return this.authenticationService.signIn(dto);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'SignUp' })
  @ApiOkResponse({
    description: 'SignUp user end point',
    type: String,
  })
  async signUp(@Body() dto: SignUpDto) {
    return this.authenticationService.signUp(dto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'SignUp' })
  @ApiOkResponse({
    description: 'SignUp user end point',
    type: String,
  })
  async refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authenticationService.refreshTokens(dto);
  }

  //if you want to make it with cookie
  // @Post()
  // @ApiOperation({ summary: 'SignUp' })
  // @ApiOkResponse({
  //   description: 'SignUp user end point',
  //   type: String,
  // })
  // async signUpWithCookie(
  //   @Res({ passthrough: true }) res: Response,
  //   @Body() dto: SignUpDto,
  // ) {
  //   const accessToken = this.authenticationService.signUp(dto);
  //   res.cookie('accessToken', accessToken, {
  //     secure: true,
  //     httpOnly: true,
  //     sameSite: true,
  //   });
  // }
}
