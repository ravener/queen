import {
  ApplicationCommandOptionType,
  CommandInteraction,
  Embed,
  EmbedBuilder,
  User
} from 'discord.js';
import { Discord, Guard, Slash, SlashChoice, SlashOption } from 'discordx';
import { getGameMode, resolveUser } from '../utils/utils.js';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { request } from '../utils/api.js';

@Discord()
export class Quaver {
  @Slash({ description: "View a Quaver user's profile." })
  @Guard(RateLimit(TIME_UNIT.seconds, 3))
  async profile(
    @SlashOption({
      description: 'User ID or Name to view.',
      name: 'user',
      type: ApplicationCommandOptionType.String
    })
    query: string | undefined,
    @SlashChoice({ name: '4 Keys', value: 'keys4' })
    @SlashChoice({ name: '7 Keys', value: 'keys7' })
    @SlashOption({
      name: 'mode',
      description: 'Game Mode',
      type: ApplicationCommandOptionType.String
    })
    gamemode: string | undefined,
    @SlashOption({
      description: 'Lookup a profile saved to someone\'s discord account.',
      name: 'discord',
      type: ApplicationCommandOptionType.User
    })
    target: User | undefined,
    interaction: CommandInteraction
  ) {
    const id = query ?? await resolveUser(interaction, target);
    if (!id) return;

    const { user } = await request(`/users/full/${encodeURIComponent(id)}`);

    if (!user) {
      return interaction.reply({
        content: `User with name or ID of \`${query}\` not found.`,
        ephemeral: true
      });
    }

    const modeKey = gamemode ?? getGameMode(user);
    const mode = user[modeKey];
    const embed = new EmbedBuilder()
      .setAuthor({
        iconURL: `https://osuflags.omkserver.nl/${user.info.country}-128.png`,
        name: `Quaver ${modeKey === 'keys7' ? '7 Keys' : '4 Keys'} Profile for ${user.info.username}`,
        url: `https://quavergame.com/user/${user.info.id}`
      })
      .setColor('#37b3ce')
      .setThumbnail(user.info.avatar_url)
      .setDescription(
        [
          `▸ **Rank:** #${mode.globalRank.toLocaleString()} (${user.info.country}#${mode.countryRank.toLocaleString()})`,
          `▸ **Overall Performance Rating:** ${mode.stats.overall_performance_rating.toFixed(2)}`,
          `▸ **Overall Accuracy:** ${mode.stats.overall_accuracy.toFixed(2)}%`,
          `▸ **Playcount:** ${mode.stats.play_count.toLocaleString()} | **Pauses:** ${mode.stats.total_pauses.toLocaleString()}`,
          `▸ **Max Combo:** ${mode.stats.max_combo.toLocaleString()}`,
          `▸ **Ranked Score:** ${mode.stats.ranked_score.toLocaleString()}`,
          `▸ **Total Score:** ${mode.stats.total_score.toLocaleString()}`,
          `▸ **Total Hits:** ${(mode.stats.total_marv + mode.stats.total_perf + mode.stats.total_great + mode.stats.total_good + mode.stats.total_okay).toLocaleString()}`,
          `▸ **Grades:** <:GradeX:1216341234273091715> \`${mode.stats.count_grade_x.toLocaleString()}\` <:GradeSS:1216341244536553562> \`${mode.stats.count_grade_ss.toLocaleString()}\` <:GradeS:1216341236642746418> \`${mode.stats.count_grade_s.toLocaleString()}\` <:GradeA:1216341239180296243> \`${mode.stats.count_grade_a.toLocaleString()}\` <:GradeB:1216341248802160660> \`${mode.stats.count_grade_b.toLocaleString()}\` <:GradeC:1216341246516264961> \`${mode.stats.count_grade_c.toLocaleString()}\` <:GradeD:1216341242070437918> \`${mode.stats.count_grade_d.toLocaleString()}\` <:GradeF:1216460076370362378> \`${mode.stats.fail_count}\``
        ].join('\n')
      );

    if (user.info.online) {
      embed.setFooter({ text: 'Online' });
    } else {
      embed.setFooter({ text: `Last seen` });
      embed.setTimestamp(new Date(user.info.latest_activity));
    }

    return interaction.reply({ embeds: [embed] });
  }
}
