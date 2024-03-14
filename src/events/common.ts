import type { ArgsOf } from 'discordx';
import { Discord, On } from 'discordx';
import { request } from '../utils/api.js';
import { EmbedBuilder } from 'discord.js';
import { getDuration, ratingEmoji } from '../utils/utils.js';

@Discord()
export class Example {
  #cooldown = new Set();

  @On()
  async messageCreate([message]: ArgsOf<'messageCreate'>): Promise<void> {
    console.log(message.author.username, 'said:', message.content);

    if (this.#cooldown.has(message.author.id)) return console.log('god damn abusers');

    const match = message.content.match(
      /https:\/\/quavergame.com\/mapset\/map\/(\d+)/i
    );
    if (!match) return;
    const id = match[1];

    // 5 seconds cooldown to prevent abuse.
    this.#cooldown.add(message.author.id);
    setTimeout(() => this.#cooldown.delete(message.author.id), 5000);

    const { map } = await request(`/maps/${id}`).catch(() => ({}));
    if (!map) return;

    const totalNotes = map.count_hitobject_normal + map.count_hitobject_long;
    const seconds = map.length / 1000;
    const NPS = (totalNotes / seconds).toFixed(2);
    const emoji = ratingEmoji(map.difficulty_rating);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${map.artist} - ${map.title} by ${map.creator_username}`,
        url: match[0]
      })
      .setColor('#37b3ce')
      .setFooter({
        text: `${map.ranked_status === 2 ? 'Ranked' : 'Unranked'} - Last updated`
      })
      .setTimestamp(new Date(map.date_last_updated))
      .setDescription(
        [
          `**Length:** ${getDuration(map.length)} **BPM:** ${map.bpm}`,
          `:inbox_tray: Download [Mapset](https://quavergame.com/download/mapset/31696) | [Map](https://api.quavergame.com/d/web/map/${map.id})`,
          '',
          `${emoji} __[${map.game_mode === 1 ? '4K' : '7K'}] ${map.difficulty_name}__`,
          `▸ **Difficulty:** ${map.difficulty_rating.toFixed(2)} ▸ **Max Combo** x${map.count_hitobject_normal + map.count_hitobject_long * 2}`,
          `▸ **Normal Objects:** ${map.count_hitobject_normal.toLocaleString()} ▸ **LNs:** ${map.count_hitobject_long.toLocaleString()} (${Math.floor((map.count_hitobject_long / (map.count_hitobject_normal + map.count_hitobject_long)) * 100)}%) ▸ **NPS:** ${NPS}`,
          `▸ **Passes/Fails:** ${map.play_count.toLocaleString()} / ${map.fail_count.toLocaleString()}`
        ].join('\n')
      );

    await message.channel
      .send({
        embeds: [embed],
        reply: { messageReference: message }
      })
      .catch(() => null);
  }
}
