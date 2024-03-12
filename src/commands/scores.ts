import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import {
  ApplicationCommandOptionType,
  CommandInteraction,
  Embed,
  EmbedBuilder
} from 'discord.js';
import { Discord, Guard, Slash, SlashChoice, SlashOption } from 'discordx';
import { request } from '../utils/api.js';
import { getGameMode } from '../utils/utils.js';
import { Grades } from '../utils/emojis.js';

@Discord()
export class Scores {
  async resolveUser(query: string, interaction: CommandInteraction) {
    const { user } = await request(`/users/full/${encodeURIComponent(query)}`);

    if (!user) {
      await interaction.reply({
        content: `User with name or ID of \`${query}\` not found.`,
        ephemeral: true
      });

      return null;
    }

    return user;
  }

  @Slash({ description: 'View the most recent play.' })
  @Guard(RateLimit(TIME_UNIT.seconds, 5))
  async recent(
    @SlashOption({
      name: 'user',
      description: 'Username or ID',
      type: ApplicationCommandOptionType.String,
      required: true
    })
    query: string,
    @SlashChoice({ name: '4 Keys', value: '1' })
    @SlashChoice({ name: '7 Keys', value: '2' })
    @SlashOption({
      name: 'mode',
      description: 'Game Mode',
      type: ApplicationCommandOptionType.String
    })
    gamemode: string | undefined,
    interaction: CommandInteraction
  ) {
    const user = await this.resolveUser(query, interaction);
    if (!user) return;
    const mode = gamemode ?? getGameMode(user) === 'keys4' ? 1 : 2;

    const {
      scores: [score]
    } = await request(
      `/users/scores/recent?id=${user.info.id}&mode=${mode}&limit=1`
    );

    if (!score) {
      return interaction.reply({
        content: `No recent plays found for \`${query}\``,
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#37b3ce')
      .setTimestamp(new Date(score.time))
      .setAuthor({
        name: `${score.map.artist} - ${score.map.title} [${score.map.difficulty_name}] +${score.mods_string}`,
        iconURL: user.info.avatar_url,
        url: `https://quavergame.com/mapset/map/${score.map.id}`
      })
      .setDescription(
        [
          `▸ ${Grades[score.grade]} ▸ **${score.performance_rating.toFixed(2)}PR** ▸ ${score.accuracy.toFixed(2)}% ▸ ${score.ratio.toFixed(2)}:1`,
          `▸ ${score.total_score.toLocaleString()} ▸ x${score.max_combo.toLocaleString()} ▸ [${score.count_marv}/${score.count_perf}/${score.count_great}/${score.count_good}/${score.count_okay}/${score.count_miss}]`,
          `▸ :inbox_tray: [Download Replay](https://api.quavergame.com/d/web/replay/${score.id})`
        ].join('\n')
      );

    return interaction.reply({ embeds: [embed] });
  }

  @Slash({ description: "View a user's best plays" })
  @Guard(RateLimit(TIME_UNIT.seconds, 3))
  async best(
    @SlashOption({
      name: 'user',
      description: 'Username or ID',
      type: ApplicationCommandOptionType.String,
      required: true
    })
    query: string,
    @SlashChoice({ name: '4 Keys', value: '1' })
    @SlashChoice({ name: '7 Keys', value: '2' })
    @SlashOption({
      name: 'mode',
      description: 'Game Mode',
      type: ApplicationCommandOptionType.String
    })
    gamemode: string | undefined,
    interaction: CommandInteraction
  ) {
    const user = await this.resolveUser(query, interaction);
    if (!user) return;
    const mode = gamemode ?? getGameMode(user) === 'keys4' ? 1 : 2;

    const { scores } = await request(
      `/users/scores/recent?id=${user.info.id}&mode=${mode}&limit=5`
    );

    if (!scores.length) {
      return interaction.reply({
        content: `No best plays found for \`${query}\``,
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#37b3ce')
      .setThumbnail(user.info.avatar_url)
      .setAuthor({
        iconURL: `https://osuflags.omkserver.nl/${user.info.country}-128.png`,
        name: `Top Quaver ${mode === 2 ? '7K' : '4K'} Plays for ${user.info.username}`,
        url: `https://quavergame.com/user/${user.info.id}`
      });

    let description = '';

    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];

      description += [
        `**${i+1}) [${score.map.title} [${score.map.difficulty_name}]](https://quavergame.com/mapset/map/${score.map.id}) +${score.mods_string}**`,
        `▸ ${Grades[score.grade]} ▸ **${score.performance_rating.toFixed(2)}PR** ▸ ${score.accuracy.toFixed(2)}% ▸ ${score.ratio.toFixed(2)}:1`,
        `▸ ${score.total_score.toLocaleString()} ▸ x${score.max_combo.toLocaleString()} ▸ [${score.count_marv}/${score.count_perf}/${score.count_great}/${score.count_good}/${score.count_okay}/${score.count_miss}]`,
        `▸ Score Set <t:${Math.floor(new Date(score.time).getTime() / 1000)}:R>`,
        `▸ :inbox_tray: [Download Replay](https://api.quavergame.com/d/web/replay/${score.id})\n`
      ].join('\n');
    }

    embed.setDescription(description);

    return interaction.reply({ embeds: [embed] });
  }
}
