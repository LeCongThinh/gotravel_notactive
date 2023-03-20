import { Module } from '@nestjs/common';
import { RestApiService } from './rest-api.service';

@Global()
@Module({
  providers: [RestApiService],
  exports: [RestApiService],
})
export class RestApiModule {}
