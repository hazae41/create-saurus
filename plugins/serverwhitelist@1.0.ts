import type { Saurus } from "../saurus/saurus.ts";
import type { Server } from "../saurus/server.ts";

const password = await Deno.readTextFile("password.txt")

export class ServerWhitelist {

  /**
   * Plugin that only allows servers with the good password.
   * Password must be written in "password.txt" at the root.
   * @param server Server you want to check
   */
  constructor(readonly server: Server) {
    if (server.password !== password)
      throw new Error("Bad password");
  }
}