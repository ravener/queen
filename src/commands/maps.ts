import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction, Embed, EmbedBuilder } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { request } from '../utils/api.js';

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
    const { mapset } = await request(`/mapsets/${id}`);

    if (!mapset) {
      return interaction.reply({
        content: `Mapset with ID \`${id}\` not found.`,
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#37b3ce');

    return interaction.reply({
      content: 'This command is not implemented yet, try again later.',
      ephemeral: true
    });
  }
}
