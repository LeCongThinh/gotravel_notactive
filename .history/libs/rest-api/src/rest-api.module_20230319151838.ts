import {Module, Global} from '@nestjs/common';
import {RestApiService} from "@app/rest-api/rest-api.service";

@Global()
@Module({
    providers: [RestApi],
    exports: [RestApi],
})
export class RestApiModule {
}
