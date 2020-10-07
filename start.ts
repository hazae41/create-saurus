import { Saurus } from "./saurus/saurus.ts";

import { TitlePinger } from "./plugins/titlepinger@1.0.ts"
import { JoinTitle } from "./plugins/jointitle@1.0.ts";
import { JoinLog } from "./plugins/joinlog@1.0.ts";
import { RemoteCMD } from "./plugins/remotecmd@1.0.ts";
import { ServerWhitelist } from "./plugins/serverwhitelist@1.0.ts";
import { DeathMsg } from "./plugins/deathmsg@1.0.ts";

const saurus = new Saurus({
  port: 8443,
  certFile: "./ssl/certificate.pem",
  keyFile: "./ssl/privatekey.pem",
})

console.log("Waiting for server...")

saurus.on(["server"], (server) => {
  console.log("Server connected:", server.platform)

  server.once(["close"], () =>
    console.log("Server disconnected"))

  const offjoin = server.players.on(["join"], (player) => {
    new DeathMsg(player, "Haha!")
  })

  server.once(["close"], offjoin)

  new ServerWhitelist(saurus)
  new JoinLog(server)
  new JoinTitle(server)
  new TitlePinger(server)
  new RemoteCMD(saurus, server)
})