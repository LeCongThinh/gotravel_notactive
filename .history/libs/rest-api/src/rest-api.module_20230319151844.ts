import {Module, Global} from '@nestjs/common';
import {RestApiService} from "@app/rest-api/rest-api.service";

@Global()
@Module({
    providers: [RestApiService],
    exports: [RestApiService],
})
export class RestApiModule {
}
