import type { Saurus } from "../saurus/saurus.ts";
import type { Server } from "../saurus/server.ts";

export class RemoteCMD {

  /**
   * Plugin that redirects commands to the given server.
   * @param saurus Your Saurus instance
   * @param server Server to redirect commands
   */
  constructor(
    readonly saurus: Saurus,
    readonly server: Server,
  ) {
    const off = saurus.console.on(["command"],
      this.oncommand.bind(this))

    server.once(["close"], off)
  }

  private async oncommand(command: string) {
    if (!command) return;

    const [label] = command.split(" ")
    if (label === "exit") Deno.exit()

    const done = await this.server.execute(command)
    if (!done) console.log("Unknown command:", label)
  }
}