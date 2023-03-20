import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';

@Module({
  imports:[],
  providers: [AuthService,JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
