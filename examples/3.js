var http = require('http'); // HTTP module

var httpGet = http.get;

httpGet('http://www.google.com/search?query=google%20cloud%20platform', (res) => {
  var buffer = '';
  res.addListener('data', (data) => {
    buffer += data.toString();
  });
  res.addListener('end', () => {
    console.log(buffer);
  });
});
