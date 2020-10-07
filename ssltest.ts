import { serveTLS } from "https://deno.land/std@0.65.0/http/server.ts";

const body = "Hello HTTPS";

const options = {
  port: 8443,
  certFile: "./ssl/certificate.pem",
  keyFile: "./ssl/privatekey.pem",
};

try {
  for await (const req of serveTLS(options)) {
    req.respond({ body });
  }
} catch (e) {
  console.error(e);
}
