import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import



@Module({
  providers: [AuthService],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {}
