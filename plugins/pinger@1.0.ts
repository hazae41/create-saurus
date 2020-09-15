import { App } from "../saurus/app.ts";
import { Player } from "../saurus/player.ts";
import { Server } from "../saurus/server.ts";
import { WSChannel } from "../saurus/websockets.ts";

export class Pinger {
  constructor(
    readonly server: Server
  ) {
    server.players.on(["join"], this.onjoin.bind(this))
  }

  private async onjoin(player: Player) {
    player.on(["app"], (app) => this.onapp(player, app))
  }

  private async onapp(player: Player, app: App) {
    app.channels.on(["ping"], (channel) => {
      try {
        this.onping(player, channel)
      } catch (e) {
        if (e instanceof Error)
          channel.close(e.message)
      }
    })
  }

  private async onping(player: Player, channel: WSChannel) {
    const method = await channel.wait<string>()

    if (method === "ping") {
      const { players } = player.server

      const name = await channel.wait<string>()
      const target = players.names.get(name)
      if (!target) throw new Error("Invalid name")

      await target.title("Ping!", `${player.name} pinged you`)
    }
  }
}