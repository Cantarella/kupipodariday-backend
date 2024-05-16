import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt-strategy.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-guard.service';
import { LocalGuard } from './local-guard.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    LocalStrategy,
    ConfigService,
    LocalGuard,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
