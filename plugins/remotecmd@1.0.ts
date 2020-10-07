import type { Saurus } from "../saurus/saurus.ts";
import type { Server } from "../saurus/server.ts";

/**
 * Plugin that redirects commands to the given server
 * @param saurus Your Saurus instance
 * @param server Server to redirect commands
 */
export class RemoteCMD {
  constructor(
    readonly saurus: Saurus,
    readonly server: Server
  ) {
    saurus.console.on(["command"],
      this.oncommand.bind(this))
  }

  private async oncommand(command: string) {
    const [label] = command.split(" ")
    const done = await this.server.execute(command)
    if (!done) console.log("Unknown command:", label)
  }
}