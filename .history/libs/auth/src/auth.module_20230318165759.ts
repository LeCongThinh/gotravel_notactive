import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';






@Module({
  impot
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
