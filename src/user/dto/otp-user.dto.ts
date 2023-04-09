import { IsEmail, IsNotEmpty } from "class-validator";

export class OtpDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email:string;
    @IsNotEmpty()
    readonly otp:string;
}