import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import { request } from '../utils/api.js';
import { EmbedBuilder, Message } from 'discord.js';
import { calculateRating, getDuration, ratingEmoji } from '../utils/utils.js';
import { reply } from '@skyra/editable-commands';

@Discord()
export class Example {
  #cooldown = new Set();

  @On()
  async messageCreate([message]: ArgsOf<'messageCreate'>, client: Client): Promise<void> {
    console.log(message.author.username, 'said:', message.content);
    await this.handleCommands(message, client);
    await this.handleMaps(message);
  }

  @On()
  async messageUpdate([old, message]: ArgsOf<'messageUpdate'>, client: Client) {
    if (old.content === message.content) return;

    await this.handleCommands(message as Message, client);
  }

  async handleCommands(message: Message, client: Client): Promise<void> {
    if (message.webhookId !== null) return;
    if (message.system) return;
    if (message.author.bot) return;

    try {
      await client.executeCommand(message);
    } catch (err: any) {
      console.error(err);
      await reply(message, `An error occurred executing command: \`${err.toString()}\``).catch(() => null);
    }
  }

  async handleMaps(message: Message): Promise<void> {
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
          `▸ **Passes/Fails:** ${map.play_count.toLocaleString()} / ${map.fail_count.toLocaleString()}`,
          `▸ **PR:** ○ **95%**–${calculateRating(map.difficulty_rating, 95).toFixed(2)} ○ **99%**–${calculateRating(map.difficulty_rating, 99).toFixed(2)} ○ **100%**–${calculateRating(map.difficulty_rating, 100).toFixed(2)}`
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
