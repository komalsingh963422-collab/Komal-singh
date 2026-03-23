const http = require("http");

http.createServer(function (req, res) {
  res.write("Kali Server Running 24/7");
  res.end();
}).listen(8080);