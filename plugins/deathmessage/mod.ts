import type { Player } from "saurus/player.ts";
import type { Server } from "saurus/server.ts";

/**
 * Example of plugin that can be enabled on both a player and a server
 * 
 * @example
 * onjoin = (p: Player) => {
 *   if (player.name === "...") {
 *     new PlayerDeathMessage(player)
 *   }
 * }
 * 
 * @example
 * onserver = (server: Server) => {
 *   if (server.name === "...") {
 *     new ServerDeathMessage(server)
 *   }
 * }
 */

const config = {
  message: (p: Player) => `Haha!`
}

export class PlayerDeathMessage {
  /**
   * Send an actionbar message when the given player is dead.
   * @param player Player to activate the plugin on
   */
  constructor(readonly player: Player) {
    const offdeath = player.on(["death"],
      () => player.actionbar(config.message(player)))

    player.once(["quit"], offdeath)
  }
}

export class ServerDeathMessage {
  /**
   * Send an actionbar message when a player is dead on the given server
   */
  constructor(readonly server: Server) {
    const off = server.players.on(["join"],
      (player) => new PlayerDeathMessage(player))

    server.once(["close"], off)
  }
}