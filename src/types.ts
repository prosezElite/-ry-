export interface Player {
  accountId: string;
  ign: string;
  discordId?: string;
  rank: string;
  elo: number;
  peakElo: number;
  wins: number;
  losses: number;
  mvpCount: number;
  kills: number;
  deaths: number;
  assists: number;
  matchesPlayed: number;
  currentStreak: number;
  region: string;
}

export interface Match {
  id: string;
  map: string;
  score: string;
  result: 'W' | 'L';
  kd: number;
  adr: number;
  mvp: boolean;
  date: string;
  eloChange: number;
}
