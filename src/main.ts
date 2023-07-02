import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as nunjucks from "nunjucks";
import { resolve } from "path";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const express = app.getHttpAdapter().getInstance();
  const views = resolve("./views");
  console.log(views);
  nunjucks.configure(views, { express, watch: true });

  app.useStaticAssets(resolve("./public"));
  app.setBaseViewsDir(views);
  app.setViewEngine("njk");
  await app.listen(3000);
}
bootstrap();
