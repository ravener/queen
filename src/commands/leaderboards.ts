import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx';
import { request } from '../utils/api.js';

@Discord()
export class Leaderboards {
  // @todo(ravener): Pagination
  // @todo(ravener): Country filter
  @Slash({ description: 'View top players in the leaderboard' })
  async leaderboard(
    @SlashChoice({ name: '4 Keys', value: '1' })
    @SlashChoice({ name: '7 Keys', value: '2' })
    @SlashOption({
      name: 'mode',
      description: 'Game Mode',
      type: ApplicationCommandOptionType.String
    })
    gamemode: string | undefined,
    interaction: CommandInteraction) {
    const { users } = await request('/leaderboard');

    return interaction.reply({
      content: 'This command is not implemented yet, try again later.',
      ephemeral: true
    });
  }
}
