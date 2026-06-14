export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarId: string;
  email: string;
  createdAt: number;
  stats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    winRate: number;
    currentStreak: number;
  };
  friends: string[];
  blocked: string[];
  achievements: Achievement[];
  recentGames: GameRecord[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: number;
}

export interface GameRecord {
  id: string;
  opponents: string[];
  result: "win" | "loss" | "spectator";
  date: number;
  duration: number;
  score?: number;
}
