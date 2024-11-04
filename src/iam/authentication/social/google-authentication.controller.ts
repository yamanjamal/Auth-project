import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './google-authentication.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GoogleTokenDto } from './dto/google-token.dto';
import { Auth } from '../decorators/auth.decorator';
import { AuthType } from '../enums/auth-type.enum';

@Auth(AuthType.None)
@ApiTags('authentication/google')
@Controller('authentication/google')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({
    description: 'Create new user end point',
    type: String,
  })
  async create(@Body() dto: GoogleTokenDto) {
    return this.googleAuthenticationService.authenticate(dto.token);
  }
}
