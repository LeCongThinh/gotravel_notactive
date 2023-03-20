import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';






@Module({
  import "module";
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
