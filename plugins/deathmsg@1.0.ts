import type { Player } from "../saurus/player.ts";

export class DeathMsg {

  /**
   * Send an actionbar message when the given player is dead.
   * @param player Player to activate the plugin on
   * @param message Message to display
   */
  constructor(
    readonly player: Player,
    readonly message: string
  ) {
    const offdeath = player.on(["death"],
      () => player.actionbar(message))

    player.once(["quit"], offdeath)
  }
}