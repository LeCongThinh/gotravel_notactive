import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { AuthModule, AuthService } from "@app/auth";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, JwtService, AuthService]
})
export class UsersModule {
}
