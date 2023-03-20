import { IsNotEmpty } from "class-validator";

export class ChangePasswordDTO
{
    @IsNotEmpty
    tokken: String;
}