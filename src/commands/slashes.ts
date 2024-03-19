import { EmbedBuilder, type CommandInteraction, version } from 'discord.js';
import {
  Client,
  Discord,
  SimpleCommand,
  SimpleCommandMessage,
  Slash
} from 'discordx';

@Discord()
export class Example {
  @Slash({ description: 'ping' })
  async ping(interaction: CommandInteraction): Promise<void> {
    const reply = await interaction.reply({
      content: 'Pong!',
      fetchReply: true
    });

    const time = reply.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply({
      content: `Pong! That only took **${time} ms**`
    });
  }

  @SimpleCommand({ description: 'Bot Statistics' })
  async stats(command: SimpleCommandMessage, client: Client) {
    const ravener = await client.users.fetch('292690616285134850');

    const users = client.guilds.cache
      .filter((guild) => guild.available)
      .reduce((sum, guild) => sum + guild.memberCount, 0);

    const embed = new EmbedBuilder()
      .setColor('#37b3ce')
      .setTimestamp()
      .setTitle('Bot Statistics')
      .setAuthor({
        name: ravener.displayName,
        iconURL: ravener.displayAvatarURL({ size: 128 }),
        url: 'https://discord.gg/DQ2BgNDb6Q'
      })
      .setDescription(
        [
          `▸ **Servers:** ${client.guilds.cache.size.toLocaleString()}`,
          `▸ **Users:** ${users.toLocaleString()}`,
          `▸ **Channels:** ${client.channels.cache.size.toLocaleString()}`,
          `▸ **Total Memory Usage:** ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
          `▸ **Memory Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          `▸ **Node.js:** ${process.version}`,
          `▸ **Discord.js:** v${version}`
        ].join('\n')
      );

    return command.message.reply({ embeds: [embed] });
  }
}
