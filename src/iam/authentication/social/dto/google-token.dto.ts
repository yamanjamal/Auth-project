import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GoogleTokenDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  token: string;
}
