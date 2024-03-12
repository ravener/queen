import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';

// @todo: map download url https://api.quavergame.com/d/web/map/1

@Discord()
export class Maps {
  @Slash({ description: 'View a mapset' })
  @Guard(RateLimit(TIME_UNIT.seconds, 3))
  async mapset(
    @SlashOption({
      name: 'mapid',
      description: 'Mapset ID',
      required: true,
      type: ApplicationCommandOptionType.Integer
    })
    id: number,
    interaction: CommandInteraction
  ) {
    return interaction.reply({
      content: 'This command is not implemented yet, try again later.',
      ephemeral: true
    });
  }
}
