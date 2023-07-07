import { Controller, Get, Post, Render, Body, Param } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Controller()
export class YoutubeController {
  @Get()
  @Render("index")
  index() {}
  @Get("/:type")
  @Render("download")
  show(@Param("type") type: string) {
    return {
      type,
      uuid: uuidv4(),
    };
  }
  @Post("/component")
  @Render("components/video-card")
  showVideos(@Body() videosBody: { videos: Array<any> }) {
    return {
      videos: videosBody,
    };
  }
}
