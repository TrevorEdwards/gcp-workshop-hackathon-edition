const http = require('http'); // HTTP module

http.get('http://www.google.com', (res) => {
  let buffer = '';
  res.addListener('data', (data) => {
    buffer += data.toString();
  });
  res.addListener('end', () => {
    console.log(buffer);
  });
});
