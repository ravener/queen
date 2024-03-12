import { Client, Discord, Once } from "discordx";

@Discord()
export class Ready {
  @Once({ event: 'ready' })
  async onReady([client]: [Client]) {
    // Synchronize applications commands with Discord
    await client.initApplicationCommands();

    console.log('Bot Started');

    // Set an activity.
    client.user!.setActivity({ name: 'Quaver' });
  }
}
