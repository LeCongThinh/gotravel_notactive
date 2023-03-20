import { ConsoleLogger, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/user.dto";
import { AppService } from "../app.service";
import * as bcrypt from "bcrypt";
import * as _ from "lodash";
import { MailService } from "@app/mailer/mailer.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtConstants } from "libs/auth/constants";
import { JwtStrategy } from "@app/auth/jwt.strategy/jwt.strategy";
// import { EnumValue } from "constants/app.resvalue";
// import { StatusEnum } from "constants/app.enum.login";

@Injectable()
export class UsersService extends AppService {
  private code;

  constructor(private mailerService: MailService) {
    super();
  }

  /**
   * Create New User
   * @param createUserDto
   */

  create = async (
    createUserDto: CreateUserDto
  ): Promise<Record<string, any> | boolean> => {
    console.log(createUserDto.email);
    if (createUserDto.password != createUserDto.repassword) {
      return false;
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    try {
      const data = await this.checkEmail(createUserDto); //Check account
      console.log("==========================>"+data);
      if (data == null || data == undefined) {
        const insertUser = await this.knexService
          ._dbConnection("users")
          .insert({
            email: createUserDto.email.toLowerCase().trim(),
            password: hash,
            salt_key: salt,
            status: 0,
          })
          .returning("id");
        const user = await this.knexService._dbConnection
          .select("*")
          .from("users")
          .where({ email: createUserDto.email.toLowerCase() })
          .first();
        const insertUser_Details = await this.knexService
          ._dbConnection("user_details")
          .insert({
            user_id: user.id,
            first_name: createUserDto.username.toLowerCase(),
          });
        return _.head(insertUser);
      } else return null; //! Can't create an account for existing
    } catch (e) {
      console.error(e.message);
      return false;
    }
  };



  findAll = async () => {
    return await this.knexService._dbConnection.select("*").from("users");
  };

  checkEmail = async (createUserDto: CreateUserDto) => {
    return await this.knexService._dbConnection
      .select("*")
      .from("users")
      .where({ email: createUserDto.email.toLowerCase() })
      .first();
  };

  checkmail = async (email: string) => {
    var data = await this.knexService._dbConnection
      .select("*")
      .from("users")
      .where({ email: email })
      .andWhere("status", 1)
      .first();
    console.log(data, "=================================");
    if (data) {
      return true;
    } else {
      return false;
    }
  };


}
