import { Cancelled } from "mutevents"

import type { Help } from "saurus/console.ts";
import type { Saurus } from "saurus/saurus.ts";
import type { Server } from "saurus/server.ts";

export class RemoteCMD {
  servers = new Map<string, Server>()

  server?: Server

  /**
   * Plugin that redirects commands to the given server.
   * @param saurus Your Saurus instance
   * @param server Server to redirect commands
   * @example
   * 'remote sunship give Hazae41 diamond'
   */
  constructor(
    readonly saurus: Saurus,
  ) {
    saurus.console.on(["command"],
      this.oncommand.bind(this))

    saurus.console.on(["help"],
      this.onhelp.bind(this))
  }

  add(
    server: Server,
    name = server.name.toLowerCase()
  ) {
    this.servers.set(name, server)

    server.once(["close"],
      () => this.servers.delete(name))
  }

  private async onhelp(help: Help) {
    if (!help.prefix) {
      help.map.set("remote", "Execute remote commands")
    }

    if (help.prefix === "remote") {
      help.map.set("remote", "Show available servers")
      help.map.set("remote <name>", "Execute remote commands on <name>")
      help.map.set("remote <name> <command>", "Execute <command> on <name>")
    }
  }

  private async oncommand(command: string) {
    const [label, ...args] = command.split(" ")

    if (this.server) {
      if (label === "exit") {
        const name = this.server.name
        delete this.server
        console.log(`No longer executing commands on ${name}.`)
      } else {
        const done = await this.server.execute(command)

        if (!done)
          console.log(`Unknown command. Type "help" for help.`)
      }

      throw new Cancelled("RemoteCMD")
    }

    else if (label === "remote") {
      if (this.server)
        throw new Error("Already connected")

      const [name, ...extras] = args

      if (!name) {
        console.log("Available servers:")

        for (const [name, server] of this.servers)
          console.log(name, "-", server.name)

        throw new Cancelled("RemoteCMD")
      }

      const server = this.servers.get(name)
      if (!server) throw new Error("Invalid server")

      if (extras.length) {
        const command = extras.join(" ")
        const done = await server.execute(command)

        if (!done)
          console.log(`Unknown command. Type "help" for help.`)
      } else {
        this.server = server;

        console.log(`Now executing commands on ${server.name}.`)
        console.log(`Type "exit" to stop executing commands.`)
      }

      throw new Cancelled("RemoteCMD")
    }
  }
}