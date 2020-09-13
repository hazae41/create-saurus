import type { Server } from "../saurus/server.ts";
import type { Player } from "../saurus/player.ts";

export class JoinTitle {
    constructor(
        readonly server: Server,
    ) {
        server.players.on(["join"], this.onjoin.bind(this))
    }

    private async onjoin(player: Player) {
        player.title("Welcome", "to Saurus")
    }
}