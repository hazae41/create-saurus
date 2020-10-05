import type { App } from "../saurus/app.ts";
import type { Player, PlayerInfo } from "../saurus/player.ts";
import type { Server } from "../saurus/server.ts";
import type { WSChannel } from "../saurus/websockets/channel.ts";

export class Pinger {
  uuids = new Map<string, boolean>()

  constructor(
    readonly server: Server
  ) {
    const offjoin = server.players.on(["join"],
      this.onjoin.bind(this))

    server.once(["close"], offjoin)
  }

  private async onjoin(player: Player) {
    const offauth = player.on(["authorize"],
      (app) => this.onapp(player, app))

    const offinfo = player.on(["info"], (info) => {
      info.pingable = this.uuids.get(player.uuid) ?? true;
    })

    player.once(["quit"], offauth, offinfo)
  }

  private async onapp(player: Player, app: App) {
    const offping = app.channels.on(["/ping"], ({ channel, data }) => {
      const { uuid } = data as PlayerInfo
      this.onping(channel, player, uuid)
    })

    const offget = app.channels.on(["/ping/get"], ({ channel, data }) => {
      const { uuid } = data as PlayerInfo
      const value = this.uuids.get(uuid) ?? true;
      channel.close(value)
    })

    const offset = app.channels.on(["/ping/set"], ({ channel, data }) => {
      const value = data as boolean
      this.uuids.set(player.uuid, value)
      channel.close()
    })

    app.once(["close"], offping, offget, offset)
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