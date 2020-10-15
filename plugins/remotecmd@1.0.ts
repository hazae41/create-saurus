import { Cancelled } from "https://deno.land/x/mutevents/mod.ts"
import type { Saurus } from "../saurus/saurus.ts";
import type { Server } from "../saurus/server.ts";

export class RemoteCMD {
  servers = new Map<string, Server>()

  server?: Server

  /**
   * Plugin that redirects commands to the given server.
   * @param saurus Your Saurus instance
   * @param server Server to redirect commands
   */
  constructor(
    readonly saurus: Saurus,
  ) {
    saurus.console.on(["command"],
      this.oncommand.bind(this))
  }

  add(
    server: Server,
    name = server.name.toLowerCase()
  ) {
    this.servers.set(name, server)

    server.once(["close"],
      () => this.servers.delete(name))
  }

  private async oncommand(command: string) {
    const [label, ...args] = command.split(" ")
    const cancelled = new Cancelled("RemoteCMD")

    if (this.server) {
      if (label === "exit") {
        delete this.server
        console.log(`No longer executing commands`)
        throw cancelled
      }

      const done = await this.server.execute(command)
      if (!done) console.log("Unknown command:", label)
      throw cancelled
    }

    if (label === "remote") {
      if (this.server)
        throw new Error("Already connected")

      const [nAmE, ...extras] = args

      if (!nAmE)
        throw new Error("Usage: remote <name> [...command]")

      const name = nAmE.toLowerCase()
      const server = this.servers.get(name)
      if (!server) throw new Error("Invalid server")

      if (extras.length) {
        const command = extras.join(" ")
        const done = await server.execute(command)
        if (!done) console.log("Unknown command:", label)
        throw cancelled
      } else {
        this.server = server;

        console.log(`Now executing commands on ${server.name}`)
        console.log(`Type "exit" to stop executing commands`)

        throw cancelled
      }
    }
  }
}