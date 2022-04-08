const fs = require('fs');

fs.copyFile('web.config', 'build/web.config', (err) => {
  if (err) throw err;
  console.log('web.config was copied to build/web.config');
});
