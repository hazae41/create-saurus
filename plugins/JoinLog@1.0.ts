import { Player } from "../saurus/player.ts";
import type { Server } from "../saurus/server.ts";

const config = {
  join: (p: Player) => `${p.name} joined the game`,
  quit: (p: Player) => `${p.name} left the game`
}

export class JoinLog {

  /**
   * Plugin that logs when a player join/leave a given server.
   * @param server Server to enable the plugin on
   */
  constructor(readonly server: Server) {
    const offjoin = server.players.on(["join"],
      (p) => console.log(config.join(p)))

    const offquit = server.players.on(["quit"],
      (p) => console.log(config.quit(p)))

    server.once(["close"], offjoin, offquit)
  }
}