import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database.service";
import { DatabaseInterface } from "../database/database.interface";
import knex from "knex";

@Injectable()
export class KnexService extends DatabaseService implements DatabaseInterface {

  private _dbConnection;
  private static instance: KnexService;
  

  get dbConnection() {
    return this._dbConnection;;
  }
  

  set dbConnection(value) {
    this._dbConnection = value;
  }

  private constructor() {
    super();
    //const connectionString = "postgresql://timesheet:123qwe@timesheet_db:5432/timesheet";
     const connectionString="postgresql://timesheet:123qwe@0.0.0.0:5432/timesheet"
    this.dbConnection = knex({
      client: "pg",
      connection: connectionString,
      debug: true,
      log: {
        error(message) {
          console.log('[ERROR]: ', message);
        },
        debug(message) {
          console.log('[DEBUG]: ', message.sql);
        },
      },
  });
  }

  

  public static getInstance = () : KnexService => {
    if (!KnexService.instance) {
      KnexService.instance = new KnexService();
    }
    
    return KnexService.instance;
  }

  getDb(): object {
    return undefined;
  }

}
