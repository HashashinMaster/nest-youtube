const fs = require("fs").promises;
const { join } = require("path");
(async () => {
  await fs.cp("views", join(__dirname, "dist", "views"), {
    recursive: true,
    overwrite: true,
  });
  await fs.cp("public", join(__dirname, "dist", "public"), {
    recursive: true,
    overwrite: true,
  });
})();
/**
 *  {
        "include": "../views",
        "outDir": "dist/views",
        "watchAssets": true
      },
      {
        "include": "../public",
        "outDir": "dist/public",
        "watchAssets": true
      }
 */
