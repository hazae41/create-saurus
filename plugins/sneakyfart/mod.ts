import { EventEmitter } from "mutevents";

import type { Player } from "saurus/player.ts";
import type { ToggleableEvents } from "saurus/plugins.ts";

export class SneakyFart extends EventEmitter<ToggleableEvents> {
  private enabled = false

  /**
   * Example of toggleable player plugin
   */
  constructor(
    readonly player: Player
  ) {
    super()

    const offFly = player.on(["fly"],
      this.onFly.bind(this))

    player.once(["quit"],
      this.disable.bind(this), offFly)

    this.init()
  }

  private async init() {
    if (!await this.player.isFlying())
      this.enable()
  }

  async enable() {
    if (this.enabled) return
    this.enabled = true

    const offsneak = this.player.on(["sneak"],
      this.onSneak.bind(this))

    this.once(["disable"], offsneak)

    await this.emit("enable", undefined)
  }

  async disable() {
    if (!this.enabled) return
    this.enabled = false

    await this.emit("disable", undefined)
  }

  private async onFly(flying: boolean) {
    if (flying) this.disable()
    else this.enable()
  }

  private async onSneak(sneaking: boolean) {
    if (sneaking) await this.player.msg("Prrr!")
  }
}