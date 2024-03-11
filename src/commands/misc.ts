import { CommandInteraction, EmbedBuilder } from "discord.js";
import { Discord, Guard, Slash } from "discordx";
import { request } from "../utils/api.js";
import { RateLimit, TIME_UNIT } from "@discordx/utilities";

@Discord()
export class Misc {
  @Slash({ description: 'View Quaver server statistics' })
  @Guard(RateLimit(TIME_UNIT.seconds, 3))
  async stats(interaction: CommandInteraction) {
    const { stats } = await request('/stats');
    const embed = new EmbedBuilder()
      .setColor('#37b3ce')
      .setTitle('Server Statistics')
      .setDescription([
        `▸ **Total Online Users:** ${stats.total_online_users.toLocaleString()}`,
        `▸ **Total Users:** ${stats.total_users.toLocaleString()}`,
        `▸ **Total Mapsets:** ${stats.total_mapsets.toLocaleString()}`,
        `▸ **Total Scores:** ${stats.total_scores.toLocaleString()}`
      ].join('\n'))
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
}
