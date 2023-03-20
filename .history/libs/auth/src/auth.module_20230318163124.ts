import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';



@Module({
  providers: [AuthService],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {}
