const webSocketsServerPort = 8000;
import { server as webSocketServer } from "websocket";
import { createServer } from "http";


// Spinning the http server and the websocket server.
const server = createServer();
server.listen(webSocketsServerPort);
console.log("listening on port 8000");


