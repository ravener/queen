import type { Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";

export const bot = new Client({
  // To use only guild command
  // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  //botGuilds: ['1130533803333521640'],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],

  // Debug logs are disabled in silent mode
  silent: false,

  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: "q!",
  },
});

bot.once("ready", async () => {
  // Make sure all guilds are cached
  // await bot.guilds.fetch();

  // Synchronize applications commands with Discord
  await bot.initApplicationCommands();

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  console.log("Bot started");
  bot.user!.setActivity({ name: 'Quaver' });
});

bot.on("interactionCreate", async (interaction: Interaction) => {
  try {
    await bot.executeInteraction(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.isRepliable()) {
      interaction.reply({
        content: 'Something went wrong when running this command, please try again later.',
        ephemeral: true
      });
    }
  }
});

bot.on("messageCreate", async (message: Message) => {
  await bot.executeCommand(message);
});
