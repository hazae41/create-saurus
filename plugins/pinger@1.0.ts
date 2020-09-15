import type { App } from "../saurus/app.ts";
import type { Player } from "../saurus/player.ts";
import type { Server } from "../saurus/server.ts";
import type { WSChannel } from "../saurus/websockets.ts";

export interface PingMessage {
  target: { name: string }
}

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
    app.channels.on(["ping"], (channel, data) => {
      try {
        this.onping(player, channel, data)
      } catch (e) {
        if (e instanceof Error)
          channel.close(e.message)
      }
    })
  }

  private async onping(player: Player, channel: WSChannel, data: unknown) {
    const { players } = player.server

    const msg = data as PingMessage

    const name = msg.target.name
    const target = players.names.get(name)
    if (!target) throw new Error("Invalid name")

    await target.title("Ping!", `${player.name} pinged you`)
  }
}