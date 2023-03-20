import { forwardRef, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { AuthModule, AuthService } from "@app/auth";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./user.service";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, JwtService, AuthService]
})
export class UsersModule {
}
