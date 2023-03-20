import { Global } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
@Global()
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
