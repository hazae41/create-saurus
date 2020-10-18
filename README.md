# Saurus

Connect your Minecraft servers together, make faster-than-light plugins, make secure and independant apps.

## Install (Linux)

- Clone the repository and its submodules

      git clone --recursive https://github.com/saurusmc/saurus

- Install Deno

      curl -fsSL https://deno.land/x/install/install.sh | sh

- Install Velociraptor

      deno install -qA -n vr https://deno.land/x/velociraptor/cli.ts

- Install Certbot

      sudo apt install certbot

- Generate SSL certificates (preferably using DNS challenge)

      sudo certbot certonly --manual --preferred-challenges dns

- Try HTTPS with `ssltest.ts` (modify port and certificates location before)

      deno run --allow-net ssltest.ts

- Modify the start script at `start.ts`

  - modify port and certificates location
  
  - add/remove plugins

- Start Saurus

      vr start

- Install the [Saurus Bukkit plugin](https://github.com/saurusmc/saurus-bukkit) on your Minecraft server and configure it