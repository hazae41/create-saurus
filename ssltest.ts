import { serveTLS } from "https://deno.land/std@0.65.0/http/server.ts";

const port = 8443

const server = serveTLS({
  port: port,
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem",
})

console.log(`Connect to https://<hostname>:${port}/ ("https" not "http")`)
console.log(`You should see "It works" and a padlock in the address bar`)
console.log("Hit Ctrl+C to exit")

for await (const req of server) {
  await req.respond({ body: "It works!" });
}