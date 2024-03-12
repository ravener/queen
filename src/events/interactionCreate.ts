import { Interaction } from 'discord.js';
import { Discord, type ArgsOf, On, Client } from 'discordx';

@Discord()
export class InteractionCreate {
  @On({ event: 'interactionCreate' })
  async onInteractionCreate(
    [interaction]: ArgsOf<'interactionCreate'>,
    client: Client
  ): Promise<void> {
    try {
      await client.executeInteraction(interaction);
    } catch (err) {
      console.error(err);

      // If the interaction can still be replied to, respond with something.
      if (interaction.isRepliable()) {
        await interaction
          .reply({
            content: 'An internal error has occurred, please try again later.',
            ephemeral: true
          })
          .catch(() => null);
      }
    }
  }
}
