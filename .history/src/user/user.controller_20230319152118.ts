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
  
  import { CreateUserDto } from "./dto/user.dto";
  import { LocalAuthGuardGuard } from "@app/auth/local-auth.guard/local-auth.guard.guard";
  import { AuthService } from "@app/auth";
  import { JwtAuthGuardGuard } from "@app/auth/jwt-auth.guard/jwt-auth.guard.guard";
  import { Response } from "express";
  import { AppController } from "../app.controller";
  import { RestApiService } from "@app/rest-api";
  import { update } from "lodash";
import { UsersService } from "./user.service";
import { StatusEnum } from "constants/app.enum.login";
  @Controller()
  export class UsersController extends AppController {
    constructor(
      private readonly usersService: UsersService,
      private authService: AuthService,
      private restApi: RestApiService
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

  }
  