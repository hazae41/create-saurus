import { Server } from "../saurus/server.ts";
import { Saurus } from "../saurus/saurus.ts";

// Echo
export class Pong {
  constructor(
    readonly saurus: Saurus,
    readonly server: Server
  ) {
    server.on(["message"], this.onmessage.bind(this))
  }

  private async onmessage(channel: string, data: unknown) {
    if (channel !== "ping") return
    await this.server.write("pong", data)
  }
}