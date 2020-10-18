import type { Server } from "saurus/server.ts";
import type { Player } from "saurus/player.ts";

export const config = {
  title: "Welcome",
  subtitle: "to Saurus"
}

export class JoinTitle {

  /**
   * When a player joins, send him a title.
   * @param server Server to activate the plugin on
   */
  constructor(readonly server: Server) {
    const offjoin = server.players.on(["join"],
      this.onjoin.bind(this))

    server.once(["close"], offjoin)
  }

  private async onjoin(player: Player) {
    const { title, subtitle } = config
    await player.title(title, subtitle)
  }
}