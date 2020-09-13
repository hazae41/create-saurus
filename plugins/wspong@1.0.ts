import { Server } from "../saurus/server.ts";
import { WSChannel } from "../saurus/websockets.ts";

// Echo
export class WSPong {
  constructor(
    readonly server: Server
  ) {
    server.on(["open"], this.onopen.bind(this))
  }

  private async onopen(channel: WSChannel) {
    const data = await channel.wait() as string

    if (data === "Ping!")
      console.log("Ping!")
  }
}