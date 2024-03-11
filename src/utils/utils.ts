export function getGameMode(user: any): string {
  // Sometimes the user's default game mode is given, sometimes not.
  const mode = user.info.information?.default_mode;

  if (mode) return ['keys4', 'keys7'][mode-1];
  return user.keys7.stats.total_score > user.keys4.stats.total_score ? 'keys7' : 'keys4';
}
