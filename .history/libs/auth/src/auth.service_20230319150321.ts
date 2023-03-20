import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";
import * as bcrypt from "bcrypt";
import { StatusEnum } from "constants/app.enum.login";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  async validateUserAndPassword(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  

  login = async (user: any) => {
    const user_id = await this.usersService.findOneByUsername(user.email);
    const payload = { user_id: user_id.id, username: user.email };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: StatusEnum.EXPIRE
      })
    };
  };

  decodetoken = async (token: any) => {
    return this.jwtService.decode(token);
  };
}
