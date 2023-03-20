import {Injectable} from "@nestjs/common";
import {LoggingService} from "../libs/logging/src/logging.service";
import {KnexService} from "../libs/database/src/knex/knex.service";

@Injectable()
export class AppService {
    private 

    protected loggingService;
    protected knexService;
    protected restAPIService;

    constructor() {
        this.loggingService = LoggingService.getInstance();
        this.knexService = KnexService.getInstance();
    }
}
