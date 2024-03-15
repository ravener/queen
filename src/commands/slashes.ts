import { type CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Example {
  @Slash({ description: "ping" })
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
}
