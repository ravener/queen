import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { request } from '../utils/api.js';
import { User } from '../entity/User.js';

@Discord()
export class Config {
  @Slash({ description: 'Link your Quaver account to your Discord account.' })
  @Guard(RateLimit(TIME_UNIT.seconds, 10))
  async link(
    @SlashOption({
      name: 'username',
      description: 'Quaver Username or ID',
      required: true,
      type: ApplicationCommandOptionType.String
    })
    name: string,
    interaction: CommandInteraction
  ) {
    const { user } = await request(`/users/full/${name}`);

    if (!user) {
      return interaction.reply({
        content: `User with name or ID \`${name}\` does not exist.`,
        ephemeral: true
      });
    }

    const data = new User();
    data.id = interaction.user.id;
    data.quaverID = user.info.id;
    await data.save();

    return interaction.reply({
      content: `Linked account \`${user.info.username}\` (${user.info.id}) successfully.`
    });
  }

  @Slash({ description: 'testing do not use' })
  async test(interaction: CommandInteraction) {
    const data = await User.findOneBy({ id: interaction.user.id });

    return interaction.reply({
      content: `\`\`\`${JSON.stringify(data, null, 2)}\`\`\``
    })
  }
}
