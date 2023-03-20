import {
    Body,
    Controller,
    Get,
    Headers,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
    Res,
    UseGuards,
  } from "@nestjs/common";
  import { UsersService } from "./users.service";
  import { CreateUserDto } from "./dto/create-user.dto";
  import { LocalAuthGuardGuard } from "@app/auth/local-auth.guard/local-auth.guard.guard";
  import { AuthService } from "@app/auth";
  import { JwtAuthGuardGuard } from "@app/auth/jwt-auth.guard/jwt-auth.guard.guard";
  import { Response } from "express";
  import { AppController } from "../app.controller";
  import { RestApi } from "@app/rest-api";
  import { ForgotPassDto } from "./dto/forgot-pass.dto";
  import { OtpDto } from "./dto/otp-user.dto";
  import { ChangePasswordDto } from "./dto/change-pass.dto";
  import { StatusEnum } from "constants/app.enum.login";
  import { UpdateCurrentCompanyDto } from "./dto/update-currentcompany.dto";
  import { update } from "lodash";
  import { CheckmailDto } from "./dto/check-mail.dto";
  @Controller()
  export class UsersController extends AppController {
    constructor(
      private readonly usersService: UsersService,
      private authService: AuthService,
      private restApi: RestApi
    ) {
      super();
    }
  
    //   @Post("/check")
    //   check(@Body() user:any){
    //     return this.usersService.checkActivationKey(user);
  
    //   }
    @Post("/a")
    text(){
        return "test API"
    }
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  
    @Get("/list")
    findAll() {
      return this.usersService.findAll();
    }
  
    @Post("/check-email")
    checkEmail(@Param("email") email: string) {
      return this.usersService.findOneByUsername(email);
    }
  
    @UseGuards(LocalAuthGuardGuard)
    @Post("/login")
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
      const userResult = await this.usersService.findOneByUsername(
        req.user.email
      );
  
      switch (userResult.status) {
        case StatusEnum.INACTIVE: {
          return this.restApi.notFound(res, "Not Active"); //404
        }
        case StatusEnum.BLOCKED: {
          return this.restApi.forbidden(res, "User is blocked"); //
        }
      }
      const token = await this.authService.login(req.user);
      return this.restApi.success(res, token);
    }
    
    @Post("/checkuser")
    async checkUser(
      @Body("email") email: any,
      @Res({ passthrough: true }) res: Response
    ) {
      const data = await this.usersService.checkUser(email);
      //  return data;
      if (!data) {
        return this.restApi.error(res, "Error");
      } else {
        return this.restApi.success(res, "Ok");
      }
    }
  
    @Get("/getall")
    getAllEmail() {
      return this.usersService.getAllEmail();
    }
  
  //Check lai thong tin
    @UseGuards(JwtAuthGuardGuard)
    @Get("/profile")
    async findProfile(@Request() req, @Res({ passthrough: true }) res: Response) {
      var string = req.header("authorization");
      var token = string.substring(7, string.length);
      const tokende = await this.authService.decodetoken(token);
      const isOk = await this.usersService.profile(tokende);
      console.log(isOk);
      return isOk;
    }
  
    @Post("/register")
    async register(
      @Body() createUserDto: CreateUserDto,
      @Res({ passthrough: true }) res: Response
    ) {
      const isOk = await this.usersService.create(createUserDto);
      if (isOk == null || isOk == undefined) {
        //! 404
        this.restApi.notFound(res, "Already exist");
      } else if (!isOk) {
        //! 400
        this.restApi.error(res, isOk);
      } else {
        //! 200
        this.restApi.success(res, isOk);
      }
    }
  
    @Post("/checkmail")
    async checkmail(
      @Body() CheckmailDto: CheckmailDto,
      @Res({ passthrough: true }) res: Response
    ) {
      const isOk = await this.usersService.checkmail(CheckmailDto.email);
      console.log(isOk);
      if(!isOk){
        //! 404
        this.restApi.notFound(res,"Not found");
      }else{
          //! 200
       this.restApi.success(res, isOk);}
    }
  
    @Post("/forgot-password")
    async forgot(
      @Body() ForgotPassDto: ForgotPassDto,
      @Res({ passthrough: true }) res: Response
    ) {
      const isOk = await this.usersService.forgotPassword(ForgotPassDto.email);
      if (isOk == 1) {
        this.restApi.success(res, isOk);
      }
      if (isOk == 0) {
        this.restApi.notFound(res, "Not Found");
      }
    }
  
    @Post("/sendmail")
    async sendmail(
      @Body() email: ForgotPassDto,
      @Res({ passthrough: true }) res: Response
    ) {
      await this.usersService.resendmail(email.email);
    }
  
    ///Check Auth
    @Put("/currentcompany")
    async currentcompany(@Headers() head, @Body() UpdateCurrentCompanyDto:UpdateCurrentCompanyDto,@Res({passthrough: true}) res: Response) {
      const tokende = await this.authService.decodetoken(head.token);
      console.log(tokende);
      const isOK = await this.usersService.cunrrentcompany(UpdateCurrentCompanyDto,tokende);
      if(isOK) {
        this.restApi.success(res,isOK);
      } else {
        this.restApi.error(res, "Error");
      }
    }
  
    @Post("/otp")
    async checkOtp(
      @Body() otp: OtpDto,
      @Res({ passthrough: true }) res: Response
    ) {
      const isOk = await this.usersService.checkOtp(otp);
      if (isOk) {
        this.restApi.success(res, isOk);
      } else {
        this.restApi.notFound(res, "Incorrect OTP");
      }
    }
  
    @Put("/changepassword")
    async newPassword(@Body() changepassDto: ChangePasswordDto) {
      var changePassWord = await this.authService.decodetoken(
        changepassDto.token
      );
      return this.usersService.changePass(changePassWord);
    }
  
    // @Get("/test")
    // test() {
    //     const test = this.usersService.getData();
    //     // const ob = test.pipe(
    //     //   map(val => {
    //     //       // Handle result
    //     //       return val * 2;
    //     //   })
    //     // );
    //     test.subscribe(([result, result2]) => {
    //         console.log(result, result2);
    //     });
    //     return test;
    //     // const isOk = await this.usersService.create(createUserDto);
    //     // this.restApi.success(res, isOk);
    //     // this.restApi.success(res, test);
    //
    // }
  }
  