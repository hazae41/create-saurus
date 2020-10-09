import type { Server } from "../saurus/server.ts";

export class ServerLog {
  /**
   * Server plugin that logs when the server is connected/disconnected.
   * @param server Server you want to activate the plugin on
   */
  constructor(server: Server) {
    console.log("Server connected:", server.name)

    server.once(["close"], () =>
      console.log("Server disconnected:", server.name))
  }
}