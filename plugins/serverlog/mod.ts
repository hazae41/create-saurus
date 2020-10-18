import type { Server } from "saurus/server.ts";

const config = {
  connect: (server: Server) =>
    `${server.name} connected`,
  disconnect: (server: Server, reason: string) =>
    `${server.name} disconnected (${reason})`,
}

export class ServerLog {
  /**
   * Server plugin that logs when the server is connected/disconnected.
   * @param server Server you want to activate the plugin on
   */
  constructor(server: Server) {
    console.log(config.connect(server))

    server.once(["close"], (e) =>
      console.log(config.disconnect(server, e.reason)))
  }
}