const mix = require("laravel-mix");
const fs = require("fs");
const { join } = require("path");
mix
  .ts("resources/ts/app.ts", "public/js/app.js")
  .ts("resources/ts/fontawsome.ts", "public/js/fontawsome.js")
  .sass("resources/css/app.scss", "public/css/app.css")
  .copy(
    "node_modules/jsoneditor/dist/jsoneditor.min.css",
    "public/css/json-editor.css",
  )
  .copy(
    "node_modules/jsoneditor/dist/img/jsoneditor-icons.svg",
    "public/css/img/jsoneditor-icons.svg",
  );

if (fs.existsSync(join(__dirname, "dist"))) {
  mix.ts("resources/ts/app.ts", "dist/public/js/app.js");
}
