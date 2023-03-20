import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggingService {
  private static instance: LoggingService;
  public static getInstance = (): LoggingService => {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
connect.
    return LoggingService.instance;
  };
  info = (text: string) => {
    const time = new Date();
    return console.info(`${time.toString()}: ${text}`);
  };

}
