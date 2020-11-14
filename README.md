# Saurus

> Connect your Minecraft servers together without proxy, make faster-than-light plugins, make secure and independant apps.

## Try it

### Saurus International Server

- Connect to `play.saurusmc.org`
- Visit https://pinger.saurusmc.org/
- Type your code in the chat `/! authorize <code>`

## Installation

- [Prerequisite](https://github.com/saurusmc/create-saurus/wiki/Prerequisite)

- [Installing Saurus](https://github.com/saurusmc/create-saurus/wiki/Installing-Saurus)

- [Configuring HTTPS](https://github.com/saurusmc/create-saurus/wiki/Configuring-HTTPS)

- [Configuring VSCode](https://github.com/saurusmc/create-saurus/wiki/Configuring-VSCode)

- Install the [Saurus Bukkit plugin](https://github.com/saurusmc/saurus-bukkit) on your Minecraft server(s) and configure it

- Start Saurus with Saurus CLI

      $ saurus start

## FAQ

#### Why use Saurus instead of BungeeCord? 

In fact, you can use both, they are complementary.

The proxy is good at being what it is, a proxy. To quickly switch from a server to another.
But if you want better network performances, you would need to ditch the proxy.

Managing servers on your proxy always has been a workaround, but it's not the actual goal of proxies.
Saurus is better at managing your servers than a traditional proxy. Plus, it opens doors to apps, securely.

It's also quicker to develop plugins/apps, everything is easier to develop and scale with Saurus.
Even traditional server plugins like "send a title to the player when he joins" are done with just a few lines.
And plugins can be developed in any language (even Java) with WebAssembly.
You can easily write global plugins that will work on all your servers, and can make your servers interact with each other.

Also, the killer feature of Saurus is its ecosystem.
Saurus uses Deno, a revolutionary flexible JavaScript runtime.
You have a startup script that allows you to cherry-pick only the features you want.
All plugins are verified before being published on the website, and they are all open-source.
It has better security standards, and aims to standardize protocols and plugins.

Saurus is revolutionary for server admins, from small server admins to large network admins.
