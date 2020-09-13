import type { Server } from "../saurus/server.ts";
import type { WSChannel } from "../saurus/websockets.ts";

// Echo
export class WSPong {
  constructor(
    readonly server: Server
  ) {
    server.on(["open"], this.onopen.bind(this))
  }

  private async onopen(channel: WSChannel, data: unknown) {
    if (data === "Ping!")
      console.log("Ping!")
  }
}