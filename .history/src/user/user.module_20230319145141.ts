import { forwardRef, Module } from "@nestjs/common";
import { AuthModule, AuthService } from "@app/auth";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./user.service";
import { UsersController } from "./user.controller";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, JwtService, AuthService]
})
export class UsersModule {
}
