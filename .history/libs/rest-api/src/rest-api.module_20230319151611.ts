import { Module } from '@nestjs/common';

@Global()
@Module({
  providers: [RestApiService],
  exports: [RestApiService],
})
export class RestApiModule {}
