import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { validate } from 'env.validation';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: { validate },
    }),
    UsersModule,
    IamModule,
  ],
})
export class AppModule {}
