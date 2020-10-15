import type { App } from "../saurus/app.ts";
import type { PlayerInfo } from "../saurus/types.ts";
import type { Player } from "../saurus/player.ts";
import type { Server } from "../saurus/server.ts";
import type { Message } from "../saurus/websockets/connection.ts";
import { Pinger } from "../saurus/plugins.ts";

export class TitlePinger implements Pinger {
  uuids = new Map<string, boolean>()

  /**
   * Pinger plugin that sends a title when a player is pinged.
   * @param server Server to activate the plugin on
   */
  constructor(
    readonly server: Server
  ) {
    const offjoin = server.players.on(["join"],
      this.onjoin.bind(this))

    server.once(["close"], offjoin)
  }

  async isPingable(player: Player) {
    return this.uuids.get(player.uuid) ?? true
  }

  async ping(player: Player, target: Player) {
    if (!await this.isPingable(target))
      throw new Error("Not pingable")

    await target.title("Ping!", `${player.name} pinged you`)
  }

  private async onjoin(player: Player) {
    const offauth = player.on(["authorize"],
      (app) => this.onapp(player, app))

    const offinfo = player.on(["extras"], (info) => {
      info.pingable = this.uuids.get(player.uuid) ?? true;
    })

    player.once(["quit"], offauth, offinfo)
  }

  private async onapp(player: Player, app: App) {
    const offping = app.channels.on(["/ping"],
      (req) => this.onping(player, req))

    const offget = app.channels.on(["/ping/get"],
      (req) => this.onget(player, req))

    const offset = app.channels.on(["/ping/set"],
      (req) => this.onset(player, req))

    app.once(["close"], offping, offget, offset)
  }

  private async onping(
    player: Player,
    request: Message
  ) {
    const { channel, data } = request as Message<PlayerInfo>

    const target = player.server.players.get(data)
    if (!target) throw new Error("Invalid target")

    await this.ping(player, target)
    await channel.close()
  }

  private async onget(
    player: Player,
    request: Message
  ) {
    const { channel, data } = request as Message<PlayerInfo>

    const target = this.server.players.get(data)
    if (!target) throw new Error("Invalid target")

    await channel.close(await this.isPingable(target))
  }

  private async onset(
    player: Player,
    request: Message
  ) {
    const { channel, data } = request as Message<boolean>
    this.uuids.set(player.uuid, data)
    await channel.close()
  }
}