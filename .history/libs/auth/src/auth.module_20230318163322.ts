import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";




@Module({
  providers: [AuthService],
  exports: [AuthService,JwtStrategy],
})
export class AuthModule {}
