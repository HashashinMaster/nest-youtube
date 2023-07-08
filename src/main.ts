import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as nunjucks from "nunjucks";
import { join } from "path";
async function bootstrap() {
  console.log(join(__dirname, "..", "public"));
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const express = app.getHttpAdapter().getInstance();
  const views = join(__dirname, "..", "views");
  const staticFolder = join(__dirname, "public");
  console.log(staticFolder);
  nunjucks.configure(views, { express, watch: true });

  app.useStaticAssets(staticFolder);
  app.setBaseViewsDir(views);
  app.setViewEngine("njk");
  await app.listen(3000);
}
bootstrap();
