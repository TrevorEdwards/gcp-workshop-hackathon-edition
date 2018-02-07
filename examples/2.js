var fs = require('fs'); // File System module

function handleReadFile(err, contents) {
  if (err) {
    console.error('=== An error occurred: ===');
    console.error(err);
  } else {
    console.log('=== This is the file: ===');
    console.log(contents);
  }
}

fs.readFile('2.js', 'utf8', handleReadFile);
fs.readFile('nonexistent.js', 'utf8', handleReadFile);
