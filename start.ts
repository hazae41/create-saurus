import { Saurus } from "./saurus/saurus.ts";
import type { Player } from "./saurus/player.ts";

import { TitlePinger } from "./plugins/titlepinger@1.0.ts"
import { JoinTitle } from "./plugins/jointitle@1.0.ts";
import { JoinLog } from "./plugins/joinlog@1.0.ts";
import { RemoteCMD } from "./plugins/remotecmd@1.0.ts";
import { ServerWhitelist } from "./plugins/serverwhitelist@1.0.ts";
import { DeathMsg } from "./plugins/deathmsg@1.0.ts";
import { ServerLog } from "./plugins/serverlog@1.0.ts";

const saurus = new Saurus({
  port: 8443,
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem",
})

console.log("Waiting for servers...")

saurus.on(["server"], (server) => {
  // Check if server is authorized
  new ServerWhitelist(server)
  new ServerLog(server)

  if (server.name === "sunship") {
    new JoinLog(server)
    new JoinTitle(server)
    new TitlePinger(server)
    new RemoteCMD(saurus, server)

    function onjoin(player: Player) {
      new DeathMsg(player, "Haha!")
    }

    server.once(["close"],
      server.players.on(["join"], onjoin))
  }
})