const http = require("http");
const routes2 = require("./routes2");

const server = http.createServer(routes2);

server.listen(5000);
