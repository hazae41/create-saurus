import { Saurus } from "./saurus/saurus.ts";

import { Pinger } from "./plugins/pinger@1.0.ts"
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
  server.on(["close"], () => console.log("Server disconnected"))

  server.players.on(["join"], (p) => {
    console.log(`${p.name} joined the game`)
  })

  server.players.on(["quit"], (p) => {
    console.log(`${p.name} left the game`)
  })

  // Redirect console commands to the server
  saurus.console.on(["command"], async (line) => {
    const [label] = line.split(" ")
    const done = await server.execute(line)
    if (!done) console.log("Unknown command:", label)
  })

  new JoinTitle(server)
  new Pinger(server)
})

console.log("Waiting for server...")