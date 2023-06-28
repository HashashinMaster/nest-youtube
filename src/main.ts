import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { resolve } from "path";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  console.log(resolve("./src/public"));
  app.useStaticAssets(resolve("./src/public"));
  app.setBaseViewsDir(resolve("./src/views"));
  app.setViewEngine("hbs");
  await app.listen(3000);
}
bootstrap();
