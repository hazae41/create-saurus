import type { ServerPlayer } from "../saurus/player.ts";

export class DeathMsg {
  constructor(
    readonly player: ServerPlayer,
    readonly message: string
  ) {
    const offdeath = player.on(["death"],
      () => player.actionbar(message))

    player.once(["quit"], offdeath)
  }
}