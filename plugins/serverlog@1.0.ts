import type { Server } from "../saurus/server.ts";

export class ServerLog {
  /**
   * Server plugin that logs when the server is connected/disconnected.
   * @param server Server you want to activate the plugin on
   */
  constructor(server: Server) {
    console.log(`${server.name} connected`)

    server.once(["close"], (e) => {
      console.log(`${server.name} disconnected (${e.reason})`)
    })
  }
}