# Saurus

Connect your Minecraft servers together, make faster-than-light plugins, make secure and independant apps.

## Install (Linux)

- Clone the repository and its submodules

      git clone --recursive https://github.com/saurusmc/saurus

- Install [Deno](https://deno.land)

      curl -fsSL https://deno.land/x/install/install.sh | sh

- Install [Saurus CLI](https://github.com/saurusmc/saurus-cli)

      deno install -r -fA --unstable -n saurus https://raw.githubusercontent.com/saurusmc/saurus-cli/master/mod.ts

- Install Certbot

      sudo apt install certbot

- Generate SSL certificates (preferably using DNS challenge)

      sudo certbot certonly --manual --preferred-challenges dns

- Try HTTPS with `ssltest.ts` (modify port and certificates location before)

      deno run --allow-net ssltest.ts

- Modify the start script at `start.ts`

  - modify port and certificates location
  
  - enable/disable plugins

- Start Saurus

      saurus start

- Install the [Saurus Bukkit plugin](https://github.com/saurusmc/saurus-bukkit) on your Minecraft server and configure it