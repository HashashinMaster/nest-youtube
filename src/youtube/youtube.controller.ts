import { Controller, Get, Post, Res, Param } from "@nestjs/common";
import { Response } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import { join } from "path";

@Controller("/api/youtube")
export class YoutubeController {
  @Post("/:videoId")
  async getVideo(@Param() params: { videoId: string }, @Res() res: Response) {
    const videoUrl = `https://www.youtube.com/watch?v=${params.videoId}`;
    const exec = promisify(execFile);
    console.log(params);
    const { stdout, stderr } = await exec(
      join(__dirname, "..", "..", "yt-dlp.exe"),
      ["--dump-json", "--no-playlist", videoUrl],
    );
    if (stderr) {
      console.log(stderr);
      return res.sendStatus(500);
    } else {
      return res.json({
        success: true,
        data: JSON.parse(stdout),
      });
    }
  }
}
