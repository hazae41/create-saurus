import { WSHandler } from "./saurus/websockets.ts";
import { Console } from "./saurus/console.ts";
import { Server } from "./saurus/server.ts";

import { WSPong } from "./plugins/wspong@1.0.ts";
import { JoinTitle } from "./plugins/jointitle@1.0.ts";

const _password = await Deno.readTextFile("password.txt")

const saurus = new Console()

const handler = new WSHandler({
  hostname: "sunship.tk",
  port: 25564,
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem"
})

class PasswordError extends Error {
  constructor() { super("Bad password") }
}

handler.on(["accept"], async (conn) => {
  const password = await conn.read()

  if (password !== _password)
    throw new PasswordError();

  const server = new Server(conn)
  console.log("Server connected")

  server.on(["close"], () => {
    console.log("Server disconnected")
  })

  server.players.on(["join"], (p) => {
    console.log(`${p.name} joined the game`)
  })

  saurus.on(["command"], (line) => {
    server.execute(line)
  })

  new JoinTitle(server)
  new WSPong(server)
})

console.log("Waiting for server...")