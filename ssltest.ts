import { serveTLS } from "https://deno.land/std@0.65.0/http/server.ts";

const body = "Hello HTTPS";

const options = {
  port: 4430,
  hostname: "sunship.tk",
  certFile: "/etc/letsencrypt/live/sunship.tk/fullchain.pem",
  keyFile: "/etc/letsencrypt/live/sunship.tk/privkey.pem",
};

try {
  for await (const req of serveTLS(options)) {
    req.respond({ body });
  }
} catch (e) {
  console.error(e);
}
