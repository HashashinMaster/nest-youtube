import { Controller, Get, Post, Render, Body, Param } from "@nestjs/common";

@Controller()
export class YoutubeController {
  @Get("/:type")
  @Render("index")
  index(@Param("type") type: string) {
    return {
      type,
    };
  }
  @Post("/component")
  @Render("components/video-card")
  showVideos(@Body() videosBody: { videos: Array<any> }) {
    console.log(videosBody);
    return {
      videos: videosBody,
    };
  }
}
