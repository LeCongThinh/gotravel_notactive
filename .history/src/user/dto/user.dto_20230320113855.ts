import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsNotEmpty()
  @Length(6, 100)
  password: string;
  @IsNotEmpty()
  @Length(6, 100)
  repassword: string;
  // @IsNotEmpty()
  //  readonly token: string;

}