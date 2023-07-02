import { Controller, Post, Res, Param, Put, Body } from "@nestjs/common";
import { Response } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import { join } from "path";

// making execFile async by wraping it inside promise
const exec = promisify(execFile);

@Controller("/api/youtube")
export class YoutubeApiController {
  @Post("video/:videoId")
  async getVideo(@Param() params: { videoId: string }, @Res() res: Response) {
    //generate video url by video id
    const videoUrl = `https://www.youtube.com/watch?v=${params.videoId}`;
    /**
     * execute yd-dlp with options:
     * --dumup-json: return video data as json
     * --no-playlist: return video only if the video in a playlist
     * videoUrl: the url of the video
     */
    const { stdout, stderr } = await exec(
      join(__dirname, "..", "..", "..", "yt-dlp.exe"),
      ["--dump-json", "--no-playlist", videoUrl],
    );
    //display error if exec func fails
    if (stderr) {
      console.log(stderr);
      return res.sendStatus(500);
    } else {
      //send data
      return res.json({
        success: true,
        data: JSON.parse(stdout),
      });
    }
  }

  @Post("playlist/:playlistId")
  async getPlaylist(
    @Param() params: { playlistId: string },
    @Res() res: Response,
  ) {
    //generate video url by video id
    const playlistUrl = `https://www.youtube.com/playlist?list=${params.playlistId}`;

    /**
     * execute yd-dlp with options:
     * --dump-single-json: dump one single json with all data of the playist.
     * --clean-info-json: Remove some internal metadata such as filenames
     * from the infojson.
     * --no-write-comments:Do not retrieve video comments.
     * And set maxBuffer to infinity because stdout is to large
     */
    const { stdout, stderr } = await exec(
      join(__dirname, "..", "..", "..", "yt-dlp.exe"),
      [
        "--dump-single-json",
        "--clean-info-json",
        "--no-write-comments",
        playlistUrl,
      ],
      { maxBuffer: Infinity },
    );

    //display error if exec func fails
    if (stderr) {
      console.log(stderr);
      return res.sendStatus(500);
    } else {
      //send data
      return res.json({
        success: true,
        data: JSON.parse(stdout),
      });
    }
  }

  @Put("/video/download")
  async downloadVideo(@Body() videoUrl: string) {
    console.log("sdasd", videoUrl);
  }
}
