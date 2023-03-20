import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
@glo
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
