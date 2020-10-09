import type { Server } from "../saurus/server.ts";

export class JoinLog {

  /**
   * Plugin that logs when a player join/leave a given server.
   */
  constructor(readonly server: Server) {
    const offjoin = server.players.on(["join"], (p) => {
      console.log(`${p.name} joined the game`)
    })

    const offquit = server.players.on(["quit"], (p) => {
      console.log(`${p.name} left the game`)
    })

    server.once(["close"], offjoin, offquit)
  }
}