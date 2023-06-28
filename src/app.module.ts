import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { YoutubeApiController } from "./youtube-api/youtube-api.controller";
import { YoutubeController } from "./youtube/youtube.controller";

@Module({
  imports: [],
  controllers: [YoutubeApiController, YoutubeController],
  providers: [AppService],
})
export class AppModule {}
