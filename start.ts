import { Saurus } from "./saurus/saurus.ts";
import type { Player } from "./saurus/player.ts";

import { TitlePinger } from "./plugins/TitlePinger@1.0.ts"
import { JoinTitle } from "./plugins/JoinTitle@1.0.ts";
import { JoinLog } from "./plugins/JoinLog@1.0.ts";
import { RemoteCMD } from "./plugins/RemoteCMD@1.0.ts";
import { ServerWhitelist } from "./plugins/ServerWhitelist@1.0.ts";
import { PlayerDeathMessage } from "./plugins/DeathMessage@1.0.ts";
import { ServerLog } from "./plugins/ServerLog@1.0.ts";
import { SneakyFart } from "./plugins/SneakyFart@1.0.ts";

const saurus = new Saurus({
  port: 8443,
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem",
})

console.log("Waiting for servers...")

const remote = new RemoteCMD(saurus)

saurus.on(["server"], (server) => {
  new ServerWhitelist(server)
  new ServerLog(server)

  remote.add(server)

  if (server.name === "Sunship") {
    new JoinLog(server)
    new JoinTitle(server)
    new TitlePinger(server)

    const onjoin = (player: Player) => {
      if (player.name === "Hazae41") {
        new PlayerDeathMessage(player)
        new SneakyFart(player)
      }
    }

    server.once(["close"],
      server.players.on(["join"], onjoin))
  }
})