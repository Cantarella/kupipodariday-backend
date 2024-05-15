import { Module } from '@nestjs/common';
import { JwtStrategyService } from './jwt.strategy.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtGuardService } from './jwt-guard.service';
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
    JwtStrategyService,
    JwtGuardService,
    LocalStrategy,
    ConfigService,
    LocalGuard,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
