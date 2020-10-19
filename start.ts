import { Saurus } from "saurus/saurus.ts";

import { RemoteCMD, ServerRemoteCMD } from "./plugins/remotecmd/mod.ts";
import { ServerWhitelist } from "./plugins/serverwhitelist/mod.ts";
import { PlayerJoinLog, ServerJoinLog } from "./plugins/joinlog/mod.ts";
import { JoinTitle } from "./plugins/jointitle/mod.ts";
import { PlayerPinger, TitlePinger } from "./plugins/titlepinger/mod.ts";
import { SneakyFart } from "./plugins/sneakyfart/mod.ts";

import type { Player } from "saurus/player.ts";

const saurus = new Saurus({
  port: 8443,
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem",
})

console.log("Waiting for servers...")

// Global plugins
const remotecmd =
  new RemoteCMD(saurus)

const pinger =
  new TitlePinger()

saurus.on(["server"], (server) => {
  // Server plugins
  new ServerWhitelist(server)
  new ServerJoinLog(server)
  new ServerRemoteCMD(remotecmd, server)

  const onjoin = (player: Player) => {
    // Player plugins
    new PlayerPinger(pinger, player)
    new PlayerJoinLog(player)
    new JoinTitle(player)
    new SneakyFart(player)
  }

  server.once(["close"],
    server.players.on(["join"], onjoin))
})