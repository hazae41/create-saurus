import { WSHandler, WSConnection } from "./saurus/websockets.ts";
import { Saurus } from "./saurus/saurus.ts";
import { Server } from "./saurus/server.ts";
import { Pong } from "./plugins/wspong@1.0.ts";

const saurus = new Saurus()

const handler = new WSHandler({
  hostname: "sunship.tk",
  port: 25564,
  certFile: "./ssl/fullchain.pem",
  keyFile: "./ssl/privkey.pem"
})

handler.on(["accept"], (conn) => {
  const server = new Server(conn)

  server.players.on(["join"], (p) => {
    console.log(`${p.name} joined the game`)
  })

  new Pong(saurus, server)
})