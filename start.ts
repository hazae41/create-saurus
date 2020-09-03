import { readLines } from "https://deno.land/std@0.65.0/io/bufio.ts";
import { EventEmitter } from "https://deno.land/x/mutevents@3.0/mod.ts"

import { WSHandler, WSConnection } from "./saurus/websockets.ts";
import { Server } from "./saurus/server.ts";

class Saurus extends EventEmitter<{
  command: [string]
}> {
  server?: Server;

  constructor(
    readonly handler: WSHandler
  ) {
    super()

    handler.on(["accept"], (conn) => this.onaccept(conn))
    this.on(["command"], (line) => this.oncommand(line))

    this.stdin()
  }

  private async stdin() {
    for await (const line of readLines(Deno.stdin))
      this.emit("command", line)
  }

  private async onaccept(conn: WSConnection) {
    this.server = new Server(conn);
  }

  private async oncommand(line: string) {
    this.server?.write("command", line)
  }

}

const handler = new WSHandler({
  hostname: "sunship.tk",
  port: 25564,
  certFile: "./ssl/fullchain.pem",
  keyFile: "./ssl/privkey.pem"
})

new Saurus(handler)
