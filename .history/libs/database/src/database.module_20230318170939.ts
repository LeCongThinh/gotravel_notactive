import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [],
  exports: [DatabaseService],
})
export class DatabaseModule {}
