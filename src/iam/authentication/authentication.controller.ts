import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

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
