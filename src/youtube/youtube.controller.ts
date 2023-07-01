import { Controller, Get, Post, Render, Body } from "@nestjs/common";

@Controller()
export class YoutubeController {
  @Get()
  @Render("index")
  index() {}
  @Post("/component")
  @Render("components/video-card")
  showVideos(@Body() videosBody: { videos: Array<any> }) {
    console.log(videosBody);
    return {
      videos: videosBody,
    };
  }
}
