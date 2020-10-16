import { serveTLS } from "https://deno.land/std@0.65.0/http/server.ts";

for await (const req of serveTLS({
  port: 8443,
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem",
})) {
  req.respond({ body: "Hello HTTPS" });
}