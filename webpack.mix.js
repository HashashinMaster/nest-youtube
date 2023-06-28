let mix = require("laravel-mix");

mix
  .ts("resources/ts/app.ts", "src/public/js/app.js")
  .sass("resources/css/app.scss", "src/public/css/app.css")
  .copy(
    "node_modules/jsoneditor/dist/jsoneditor.min.css",
    "src/public/css/json-editor.css",
  )
  .copy(
    "node_modules/jsoneditor/dist/img/jsoneditor-icons.svg",
    "src/public/css/img/jsoneditor-icons.svg",
  );
