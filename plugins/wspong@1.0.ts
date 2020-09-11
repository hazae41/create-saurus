import { Server } from "../saurus/server.ts";

// Echo
export class WSPong {
  constructor(
    readonly server: Server
  ) {
    server.on(["message"], this.onmessage.bind(this))
  }

  private async onmessage(channel: string, data: unknown) {
    if (channel !== "ping") return
    console.log("Ping!")
  }
}