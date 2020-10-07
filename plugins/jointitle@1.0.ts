import type { Server } from "../saurus/server.ts";
import type { ServerPlayer } from "../saurus/player.ts";

export const config = {
  title: "Welcome",
  subtitle: "to Saurus"
}

/**
 * When a player joins, send him a title
 * @param server Server to activate the plugin on
 */
export class JoinTitle {
  constructor(readonly server: Server) {
    const offjoin = server.players.on(["join"],
      this.onjoin.bind(this))

    server.once(["close"], offjoin)
  }

  private async onjoin(player: ServerPlayer) {
    const { title, subtitle } = config
    await player.title(title, subtitle)
  }
}