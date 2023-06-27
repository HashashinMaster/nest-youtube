import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YoutubeController } from './youtube/youtube.controller';

@Module({
  imports: [],
  controllers: [AppController, YoutubeController],
  providers: [AppService],
})
export class AppModule {}
