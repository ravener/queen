import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Guard, Slash } from 'discordx';
import { request } from '../utils/api.js';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';

@Discord()
export class Misc {
  @Slash({ description: 'View Quaver server statistics' })
  @Guard(RateLimit(TIME_UNIT.seconds, 3))
  async stats(interaction: CommandInteraction) {
    const { stats } = await request('/stats');
    const embed = new EmbedBuilder()
      .setColor('#37b3ce')
      .setTitle('Game Server Statistics')
      .setTimestamp()
      .setDescription(
        [
          `▸ **Total Online Users:** ${stats.total_online_users.toLocaleString()}`,
          `▸ **Total Users:** ${stats.total_users.toLocaleString()}`,
          `▸ **Total Mapsets:** ${stats.total_mapsets.toLocaleString()}`,
          `▸ **Total Scores:** ${stats.total_scores.toLocaleString()}`
        ].join('\n')
      );

    return interaction.reply({ embeds: [embed] });
  }

  @Slash({
    description: 'View statistics about players per country',
    name: 'country-stats'
  })
  @Guard(RateLimit(TIME_UNIT.seconds, 5))
  async countryStats(interaction: CommandInteraction) {
    const { countries } = await request('/stats/country');
    const total = countries.total;
    delete countries.total;
    const keys = Object.keys(countries).sort((a, b) => countries[a] < countries[b] ? 1 : -1).slice(0, 25);

    const embed = new EmbedBuilder()
      .setColor('#37b3ce')
      .setTimestamp()
      .setTitle('Top 25 countries by player count')
      //.setDescription(table);
      .setDescription(
        keys
          .map((key) => {
            const emoji = (key === '' || key === 'xx') ? ':question:' : `:flag_${key}:`;
            const percentage = (countries[key] / total * 100).toFixed(2);
            return `${emoji} **${key.toUpperCase()}** ${countries[key].toLocaleString()} (${percentage}%)`;
          })
          .join('\n') + `\n\n**Total Players:** ${total.toLocaleString()}`
      );

    return interaction.reply({ embeds: [embed] });
  }
}
