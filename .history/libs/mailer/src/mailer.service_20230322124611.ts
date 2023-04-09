import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import path, { join } from "path";


@Injectable()
export class MailService {
    constructor(private mailerService: MailerService){}
    sendMail = async(email,code) => {
        await this.mailerService.sendMail({
            to: email,
            subject: "Appplication GoTravel OTP",
            template: './otp-code',
            context: {
                //username: username,
                code: code,
            },
        });
    }
}