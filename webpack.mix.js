let mix = require("laravel-mix");

mix
  .ts("resources/ts/app.ts", "src/public/js/app.js")
  .sass("resources/css/app.scss", "src/public/css/app.css");
