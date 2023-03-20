import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';






@Module({
  <i class="fas fa-file-import    "></i>
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
