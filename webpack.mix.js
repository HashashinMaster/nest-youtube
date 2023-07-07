let mix = require("laravel-mix");

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
