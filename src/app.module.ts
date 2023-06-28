import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { YoutubeApiController } from "./youtube-api/youtube-api.controller";

@Module({
  imports: [],
  controllers: [AppController, YoutubeApiController],
  providers: [AppService],
})
export class AppModule {}
