import { Saurus } from "saurus/saurus.ts";

import { RemoteCMD } from "./plugins/remotecmd/mod.ts";
import { ServerWhitelist } from "./plugins/serverwhitelist/mod.ts";
import { ServerLog } from "./plugins/serverlog/mod.ts";
import { JoinLog } from "./plugins/joinlog/mod.ts";
import { JoinTitle } from "./plugins/jointitle/mod.ts";
import { TitlePinger } from "./plugins/titlepinger/mod.ts";
import { PlayerDeathMessage } from "./plugins/deathmessage/mod.ts";
import { SneakyFart } from "./plugins/sneakyfart/mod.ts";

import type { Player } from "saurus/player.ts";

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