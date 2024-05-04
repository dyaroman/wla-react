const fs = require('fs');

['web.config', 'CHANGELOG.md'].forEach((file) => {
  fs.copyFile(file, `build/${file}`, (err) => {
    if (err) throw err;
    console.log(`${file} was copied to build/${file}`);
  });
});
