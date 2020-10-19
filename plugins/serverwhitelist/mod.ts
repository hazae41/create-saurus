import type { Server } from "saurus/server.ts";

let password: string;

try {
  const passwordURL = new URL("password.txt", import.meta.url)
  password = await Deno.readTextFile(passwordURL)
} catch (e: unknown) {
  console.warn("[RemoteCMD] Could not find password.txt")
}

export class ServerWhitelist {

  /**
   * Plugin that only allows servers with the good password.
   * Password must be written in "password.txt" at the root.
   * @param server Server you want to check
   */
  constructor(readonly server: Server) {
    if (!password || server.password !== password)
      throw new Error("Bad password");
  }
}