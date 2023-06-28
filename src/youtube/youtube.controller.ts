import { Controller, Get, Render } from "@nestjs/common";

@Controller()
export class YoutubeController {
  @Get()
  @Render("index")
  index() {
    return {
      hello: "hello world",
    };
  }
}
