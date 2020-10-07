import type { Server } from "../saurus/server.ts";

/**
 * Plugin that logs when a player join/leave a given server
 */
export class JoinLog {
  constructor(readonly server: Server) {
    server.players.on(["join"], (p) => {
      console.log(`${p.name} joined the game`)
    })

    server.players.on(["quit"], (p) => {
      console.log(`${p.name} left the game`)
    })
  }
}