import { Saurus } from "saurus/saurus.ts";

import { RemoteCMD } from "./plugins/remotecmd/mod.ts";
import { ServerWhitelist } from "./plugins/serverwhitelist/mod.ts";
import { PlayerJoinLog, ServerJoinLog } from "./plugins/joinlog/mod.ts";
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

const remotecmd = new RemoteCMD(saurus)

saurus.on(["server"], (server) => {
  new ServerWhitelist(server)
  new PlayerJoinLog(server)
  new ServerJoinLog(server)
  new JoinTitle(server)
  new TitlePinger(server)

  remotecmd.add(server)

  const onjoin = (player: Player) => {
    new PlayerDeathMessage(player)
    new SneakyFart(player)
  }

  server.once(["close"],
    server.players.on(["join"], onjoin))
})