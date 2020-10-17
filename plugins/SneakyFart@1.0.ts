import { EventEmitter } from "https://deno.land/x/mutevents@5.2.2/mod.ts";
import { Player } from "../saurus/player.ts";
import { Toggleable, ToggleableEvents } from "../saurus/plugins.ts";

export class SneakyFart extends EventEmitter<ToggleableEvents> {
  private _enabled = false

  /**
   * Example of toggleable player plugin
   */
  constructor(
    readonly player: Player
  ) {
    super()

    const offenable = this.on(["enable"],
      this.onEnable.bind(this))

    const offdisable = this.on(["disable"],
      this.onDisable.bind(this))

    player.once(["quit"], offenable, offdisable)

    this.enable()
  }

  get enabled() { return this._enabled }

  async enable() {
    if (this.enabled)
      throw new Error("Already enabled")
    this._enabled = true
    await this.emit("enable", undefined)
  }

  async disable() {
    if (!this.enabled)
      throw new Error("Already disabled")
    this._enabled = false
    await this.emit("disable", undefined)
  }

  private async onEnable() {
    const offsneak = this.player.on(["sneak"],
      this.onSneak.bind(this))

    const offquit = this.player.once(["quit"],
      this.disable.bind(this))

    this.once(["disable"], offsneak, offquit)

    console.log("Enabled SneakyFart for", this.player.name)
  }

  private async onDisable() {
    console.log("Disabled SneakyFart for", this.player.name)
  }

  private async onSneak(sneaking: boolean) {
    if (await this.player.isFlying()) return;
    if (sneaking) await this.player.msg("Prrr!")
  }
}