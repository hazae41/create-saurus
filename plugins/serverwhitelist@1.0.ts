import type { Saurus } from "../saurus/saurus.ts";
import type { Server } from "../saurus/server.ts";

const password = await Deno.readTextFile("password.txt")

/**
 * Plugin that only allows servers with the good password
 * Password must be written in "password.txt" at the root
 * @param saurus Your Saurus instance
 */
export class ServerWhitelist {
  constructor(readonly saurus: Saurus) {
    saurus.on(["server", "before"],
      this.onserver.bind(this))
  }

  private onserver(server: Server) {
    if (server.password !== password)
      throw new Error("Bad password");
  }
}