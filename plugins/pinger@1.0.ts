import { Player } from "../saurus/player.ts";
import { Server } from "../saurus/server.ts";

export class Pinger {
  constructor(
    readonly server: Server
  ) {
    server.players.on(["join"], this.onjoin.bind(this))
  }

  private async onjoin(player: Player) {
    player.on(["app"], (app) => {
      
    })
  }
}