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
  checkUser = async (email: string) => {
    try {
      const user = await this.knexService._dbConnection
        .select("*")
        .from("users")
        .where({ email: email.toLocaleLowerCase().trim() })
        .andWhere({ status: 1 })
        .first();
      if (user) {
        return true;
      } else {
        return false;
      }
      // return user;
      // if(user.email!=null){
      //   return true;
      // }else
      // return false;
    } catch (error) {
      return false;
    }
  };
  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // getData(): Observable<any> {
  //     const test = this.knexService._dbConnection.select("*")
  //       .from("users");
  //     const test2 = this.knexService._dbConnection.select("*")
  //       .from("users").where({
  //           email: "nhatnguyen@eos-solutions.tech"
  //       }).first()
  //
  //     return forkJoin([test, test2]);
  // }
  findOneByUsername = async (email: string) => {
    return await this.knexService._dbConnection
      .select("*")
      .from("users")
      .where({ email: email.toLowerCase() })
      // .andWhere("status", 1)
      .first();
  };

  forgotPassword = async (email: string) => {
    const startTime = performance.now();
    var data = await this.knexService._dbConnection
      .select("*")
      .from("users")
      .where({ email: email })
      .first()
      .catch((error) => {
        console.error(error);
      });
    console.log("Excution time: ", performance.now() - startTime);
    if (data != undefined) {
      return 1;
    } else {
      return 0;
    }
  };

  ///Khong lay het
  profile = async (email: any): Promise<Record<string, any> | boolean> => {
    const user = await this.knexService
      ._dbConnection("users")
      .join("user_details", "users.id", "=", "user_details.user_id")
      .select("*")
      .where({ email: email.username })
      .first();
    return user;
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

  checkOtp = async (otp: OtpDto) => {
    const d = new Date();
    var data = await this.knexService._dbConnection
      .select("*")
      .from("user_otp")
      .where("email", otp.email)
      .andWhere("otp", otp.otp)
      .andWhere("expire", ">", d.getTime())
      .first();
    console.log(data);
    if (data != undefined) {
      await this.changeStatus(otp.email);/////////////////////////////////////////////////
      await this.knexService
        ._dbConnection("user_otp")
        .where({ email: data.email })
        .del();
      return true;
    } else {
      return false;
    }
  };

  resendmail = async (email: string) => {
    var checkotp = await this.knexService._dbConnection
      .select("*")
      .from("user_otp")
      .where({ email: email })
      .first();

    if (checkotp != undefined) {
      await this.knexService
        ._dbConnection("user_otp")
        .where({ email: email })
        .del();
    }
    this.code = Math.floor(10000 + Math.random() * 90000).toString();
    const d = new Date();

    const insertUserOtp = await this.knexService
      ._dbConnection("user_otp")
      .insert({
        email: email,
        otp: this.code,
        expire: d.setTime(d.getTime() + 60 * 1000),
      });
    //Tam Thoi
    const user = await this.knexService
      ._dbConnection("users")
      .join("user_details", "users.id", "=", "user_details.user_id")
      .select("*")
      .where({ email: email })
      .first();

    //

    await this.mailerService.sendMail(email, user.first_name, this.code);
  };

  changeStatus = async (email: string) => {
    await this.knexService
      ._dbConnection("users")
      .update({ status: 1 })
      .where({ email: email });
  };

  cunrrentcompany = async (
    UpdateCurrentCompanyDto: UpdateCurrentCompanyDto,token:any
  ) => {
    var data = await this.knexService
      ._dbConnection("users")
      .update({ current_company: UpdateCurrentCompanyDto.company_id })
      .where({ email: token.email });
    if (data != undefined) {
      return true;
    } else {
      return false;
    }
  };

  changePass = async (
    newpassword: any
  ): Promise<Record<string, any> | boolean> => {
    console.log(newpassword.email);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newpassword.newpass, salt);

    if (newpassword.newpass == newpassword.confirmpassword) {
      try {
        const updateUser = await this.knexService
          ._dbConnection("users")
          .update({
            password: hash,
          })
          .where("email", newpassword.email);

        return _.head(updateUser);
      } catch (e) {
        console.error(e.message);
        return false;
      }
    } else {
      return false;
    }
  };

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getAllEmail = async () => {
    const data = await this.knexService._dbConnection("users").select("*");
    const items: string[] = data.map((element) => element.email);
    return items;
  };
}
