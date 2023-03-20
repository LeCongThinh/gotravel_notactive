import {Module, Options} from "@nestjs/common";
import {AppService} from "./app.service";
import {UsersModule} from "./users/users.module";
import {RouterModule} from "@nestjs/core";
import {LoggingModule} from "../libs/logging/src/logging.module";
import {PassportModule} from "@nestjs/passport";
import {AuthService, LocalStrategy} from "@app/auth";
import {UsersService} from "./users/users.service";
import {JwtService} from "@nestjs/jwt";
import {JwtStrategy} from "@app/auth/jwt.strategy/jwt.strategy";
import {RestApiModule} from "@app/rest-api/rest-api.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import configuration from '../config/configuration';
import { MailModule } from "@app/mailer/mailer.module";
import { MailService } from "@app/mailer/mailer.service";

@Module({
    imports: [
        PositionModule,
        CompanyModule,ClientModule,
        UsersModule, PassportModule, LoggingModule, RestApiModule, RouterModule.register([
        {
            path: "users",
            module: UsersModule
        }
    ]),
        ConfigModule.forRoot({isGlobal: true, load: [configuration]}),
        MailModule,
        MembersModule,
    ],
    //controllers: [MembersController],
    providers: [CompanyService,ClientService,AppService, UsersService, JwtService, AuthService, LocalStrategy, JwtStrategy, MailService]
})
export class AppModule {
}
