const fs = require('fs'); // File System module

function handleReadFile(err, contents) {
  if (err) {
    console.error(err);
  } else {
    console.log(contents);
  }
}

fs.readFile('2.js', 'utf8', handleReadFile);

fs.readFile('nonexistent', 'utf8', handleReadFile);
