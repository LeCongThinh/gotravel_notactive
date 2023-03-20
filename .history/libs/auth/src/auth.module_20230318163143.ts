import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';




@Module({
  providers: [AuthService],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {}
