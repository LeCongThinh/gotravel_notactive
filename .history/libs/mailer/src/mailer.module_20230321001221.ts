import { MailerModule } from "@nestjs-modules/mailer";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "config/configuration";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from "./mailer.service";


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        console.log(config);
        console.info(config.get("mail.host"));
        return {
          transport: {
            host: config.get("mail.host"),
            port: config.get("mail.port"),
            secure: true,
            auth: {
              user: config.get("mail.username"),
              pass: config.get("mail.password")
            }
          },
          defaults: {
            from: `"GoTravel" <${config.get("mail.mail_from")}>`
          },
          template: {
            dir: "templates/email",
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true
            }
          }
        };
      },
      inject: [ConfigService]
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {
}
