import { Player } from "../saurus/player.ts";
import { Toggleable } from "../saurus/plugins.ts";
import { Server } from "../saurus/server.ts";

export class TestPlugin implements Toggleable {
  private off?: () => void

  /**
   * Example of toggleable player plugin
   */
  constructor(
    readonly player: Player
  ) {
    this.enable()
  }

  private async onchat() {
    await this.player.msg("It works!")
  }

  get enabled() {
    return Boolean(this.off)
  }

  enable() {
    if (this.off)
      throw new Error("Already enabled")

    this.off = this.player.on(["chat"],
      this.onchat.bind(this))

    this.player.once(["quit"],
      this.disable.bind(this))

    console.log("Enabled TestPlugin for", this.player.name)
  }

  disable() {
    if (!this.off)
      throw new Error("Already disabled")

    this.off()
    delete this.off

    console.log("Disabled TestPlugin for", this.player.name)
  }
}