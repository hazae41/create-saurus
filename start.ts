import { Saurus } from "./saurus/saurus.ts";

import { WSPong } from "./plugins/wspong@1.0.ts";
import { JoinTitle } from "./plugins/jointitle@1.0.ts";

const saurus = new Saurus({
  port: 25564,
  hostname: "sunship.tk",
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem",
  password: await Deno.readTextFile("password.txt")
})

saurus.handler.on(["server"], async (server) => {
  console.log("Server connected", server.platform)

  server.on(["close"], () => {
    console.log("Server disconnected")
  })

  server.players.on(["join"], (p) => {
    console.log(`${p.name} joined the game`)
  })

  // Redirect console commands to the server
  saurus.console.on(["command"], (line) => {
    server.execute(line)
  })

  new JoinTitle(server)
  new WSPong(server)
})

console.log("Waiting for server...")