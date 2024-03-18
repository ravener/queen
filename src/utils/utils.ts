import { CommandInteraction } from "discord.js";
import { User } from "../entity/User.js";

export function getGameMode(user: any): string {
  // Sometimes the user's default game mode is given, sometimes not.
  const mode = user.info.information?.default_mode;

  if (mode) return ['keys4', 'keys7'][mode-1];
  return user.keys7.stats.total_score > user.keys4.stats.total_score ? 'keys7' : 'keys4';
}

/**
 * Formats a length of time into a readable string.
 * @param time The length in milliseconds
 * @returns The humanized duration in the format of mm:ss
 */
export function getDuration(time: number): string {
  const seconds = Math.floor(time / 1000) % 60 ;
  const minutes = Math.floor((time / (1000 * 60)) % 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// TODO: Find better emojis for these, perhaps custom emojis?
export function ratingEmoji(rating: number): string {
  // Beginner
  if (rating < 1) return ':white_heart:';
  // Easy
  if (rating < 2.5) return ':green_heart:';
  // Normal
  if (rating < 10) return ':blue_heart:';
  // Hard
  if (rating < 20) return ':orange_heart:';
  // Insane
  if (rating < 30) return ':heart:';
  // Expert
  if (rating < 40) return ':pink_heart:';
  // Extreme
  if (rating < 50) return ':purple_heart:';

  // Master
  return ':grey_heart:';
}

export function calculateRating(difficulty: number, accuracy: number): number {
  return difficulty * Math.pow(accuracy / 98, 6);
}

export async function resolveUser(interaction: CommandInteraction): Promise<string | undefined> {
  const { id } = interaction.user;
  const user = await User.findOneBy({ id });

  if (!user) {
    await interaction.reply({
      content: 'You do not have an account linked, either run the command and include a username/id or link your account with the `/link` command.',
      ephemeral: true
    });

    return;
  }

  return user.quaverID;
}
