import { Saurus } from "saurus/saurus.ts";
import { JoinEvent } from "saurus/players.ts"

import { RemoteCMD, ServerRemoteCMD } from "./plugins/remotecmd/mod.ts";
import { ServerWhitelist } from "./plugins/serverwhitelist/mod.ts";
import { PlayerJoinLog, ServerJoinLog } from "./plugins/joinlog/mod.ts";
import { JoinTitle } from "./plugins/jointitle/mod.ts";
import { PlayerPinger, TitlePinger } from "./plugins/titlepinger/mod.ts";

const saurus = new Saurus({
  port: 8443,
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem",
})

// Debug messages
saurus.handler.ws.on(["accept", "before"],
  conn => conn.on(["message"], console.log))

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

  const onjoin = ({ player }: JoinEvent) => {
    // Player plugins
    new PlayerPinger(pinger, player)
    new PlayerJoinLog(player)
    new JoinTitle(player)
  }

  server.once(["close"],
    server.players.on(["join"], onjoin))
})