# Saurus

Connect your Minecraft servers together, make faster-than-light plugins, make secure and independant apps.

## Installation

### Prerequisite (Linux)

#### Curl

    sudo apt install curl

#### Git

    sudo apt install git

#### Deno

- Install [Deno](https://deno.land)

      curl -fsSL https://deno.land/x/install/install.sh | sh

- Add Deno to your PATH in the `~/.bash_profile` file (create it if it doesn't exist)

      export DENO_INSTALL="~/.deno"
      export PATH="$DENO_INSTALL/bin:$PATH"

### Install Saurus

- Install [Saurus CLI](https://github.com/saurusmc/saurus-cli)

      deno install -r -fA --unstable -n saurus https://raw.githubusercontent.com/saurusmc/saurus-cli/master/mod.ts

- Install Saurus in `<directory>` with Saurus CLI

  ```
  saurus create <directory>
  ```

### Configure HTTPS (Linux)

- Install Certbot

      sudo apt install certbot

- Generate SSL certificates (preferably using DNS challenge)

      sudo certbot certonly --manual --preferred-challenges dns

- Try HTTPS with `ssltest.ts` (modify port and certificates location before)

      deno run --allow-net ssltest.ts

### Configure Saurus

- Modify the start script at `start.ts`

  - modify port and certificates location
  
  - enable/disable plugins

- Install the [Saurus Bukkit plugin](https://github.com/saurusmc/saurus-bukkit) on your Minecraft server(s) and configure it

- Start Saurus with Saurus CLI

      saurus start
