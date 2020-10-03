import { Saurus } from "./saurus/saurus.ts";

import { Pinger } from "./plugins/pinger@1.0.ts"
import { JoinTitle } from "./plugins/jointitle@1.0.ts";
import type { ListenOptions } from "./saurus/websockets/server.ts";

const password = await Deno.readTextFile("password.txt")

const options: ListenOptions = {
  port: 25564,
  hostname: "sunship.tk",
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem",
}

const saurus = new Saurus(options)

console.log("Waiting for server...")

saurus.handler.on(["server"], async (server) => {
  if (server.password !== password)
    throw new Error("Bad password");

  console.log("Server connected", server.platform)

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

  server.once(["close"], () => {
    console.log("Server disconnected")
  })

  new JoinTitle(server)
  new Pinger(server)
})