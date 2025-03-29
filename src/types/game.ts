export interface Player {
  id: string;
  name: string;
  points: number;
  totalLosses: number;
}

export interface GameSession {
  id: string;
  date: string;
  players: Player[];
  completed: boolean;
}

export interface GameState {
  players: Player[];
  sessions: GameSession[];
  currentSession: GameSession | null;
} 