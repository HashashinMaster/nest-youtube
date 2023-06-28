let mix = require("laravel-mix");

mix
  .ts("resources/ts/app.ts", "public/js/app.js")
  .sass("resources/css/app.scss", "public/css/app.css");
