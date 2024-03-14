import { Client, Discord, Once } from "discordx";

@Discord()
export class Ready {
  @Once({ event: 'ready' })
  async onReady([client]: [Client]) {
    // Synchronize applications commands with Discord
    await client.initApplicationCommands();

    console.log(`Logged in as ${client.user!.tag} (${client.user!.id}) in ${client.guilds.cache.size} servers.`);

    // Set an activity.
    client.user!.setActivity({ name: 'Quaver' });
  }
}
