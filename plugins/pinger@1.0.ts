import type { App } from "../saurus/app.ts";
import type { Player, PlayerInfo, UUID } from "../saurus/player.ts";
import type { Server } from "../saurus/server.ts";
import type { WSChannel } from "../saurus/websockets.ts";

export class Pinger {
  uuids = new Map<UUID, boolean>()

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
      const { uuid } = data as PlayerInfo
      this.onping(channel, player, uuid)
    })

    app.channels.on(["ping.get"], (channel, data) => {
      const { uuid } = data as PlayerInfo
      const value = this.uuids.get(uuid);
      channel.write(value ?? true)
    })

    app.channels.on(["ping.set"], (_, data) => {
      const value = data as boolean
      this.uuids.set(player.uuid, value)
    })
  }

  private async onping(
    channel: WSChannel,
    player: Player,
    uuid: UUID
  ) {
    try {
      const { players } = player.server

      const target = players.uuids.get(uuid)
      if (!target) throw new Error("Invalid name")

      const pingable = this.uuids.get(uuid) ?? true;
      if (!pingable) throw new Error("Not pingable")

      await target.title("Ping!", `${player.name} pinged you`)
    } catch (e) {
      if (e instanceof Error)
        channel.close(e.message)
    }
  }
}