import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { YoutubeApiController } from "./youtube-api/youtube-api.controller";
import { YoutubeController } from './youtube/youtube.controller';

@Module({
  imports: [],
  controllers: [AppController, YoutubeApiController, YoutubeController],
  providers: [AppService],
})
export class AppModule {}
