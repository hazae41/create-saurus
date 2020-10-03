import type { App } from "../saurus/app.ts";
import type { Player, PlayerInfo } from "../saurus/player.ts";
import type { Server } from "../saurus/server.ts";
import type { WSChannel } from "../saurus/websockets/channel.ts";

export class Pinger {
  uuids = new Map<string, boolean>()

  constructor(
    readonly server: Server
  ) {
    const off = server.players.on(["join"],
      this.onjoin.bind(this))

    server.once(["close"], off)
  }

  private async onjoin(player: Player) {
    const off = player.on(["authorize"],
      (app) => this.onapp(player, app))

    player.once(["quit"], off)
  }

  private async onapp(player: Player, app: App) {
    const off1 = app.channels.on(["/ping"], ({ channel, data }) => {
      const { uuid } = data as PlayerInfo
      this.onping(channel, player, uuid)
    })

    const off2 = app.channels.on(["/ping/get"], ({ channel, data }) => {
      const { uuid } = data as PlayerInfo
      const value = this.uuids.get(uuid) ?? true;
      channel.close(value)
    })

    const off3 = app.channels.on(["/ping/toggle"], ({ channel }) => {
      const value = this.uuids.get(player.uuid) ?? true
      this.uuids.set(player.uuid, !value)
      channel.close(value)
    })

    app.once(["close"], () => { off1(); off2(); off3() })
  }

  private async onping(
    channel: WSChannel,
    player: Player,
    uuid: string
  ) {
    try {
      const { players } = player.server

      const target = players.uuids.get(uuid)
      if (!target) throw new Error("Invalid name")

      const pingable = this.uuids.get(uuid) ?? true;
      if (!pingable) throw new Error("Not pingable")

      await target.title("Ping!", `${player.name} pinged you`)
      await channel.close()
    } catch (e) {
      if (e instanceof Error)
        await channel.throw(e.message)
    }
  }
}