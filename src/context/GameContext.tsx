'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { GameState, Player, GameSession } from '@/types/game';
import { v4 } from 'uuid';

interface GameContextType {
  gameState: GameState;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePoints: (playerId: string, points: number) => void;
  startNewSession: () => void;
  endCurrentSession: () => void;
  clearSessions: () => void;
}

const defaultGameState: GameState = {
  players: [],
  sessions: [],
  currentSession: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gameState');
      return saved ? JSON.parse(saved) : defaultGameState;
    }
    return defaultGameState;
  });

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  const addPlayer = (name: string) => {
    const newPlayer: Player = {
      id: v4(),
      name,
      points: 0,
      totalLosses: 0,
    };

    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
  };

  const removePlayer = (id: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(player => player.id !== id),
    }));
  };

  const updatePoints = (playerId: string, points: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId
          ? { ...player, points: player.points + points }
          : player
      ),
      currentSession: prev.currentSession
        ? {
            ...prev.currentSession,
            players: prev.currentSession.players.map(player =>
              player.id === playerId
                ? { ...player, points: player.points + points }
                : player
            ),
          }
        : null,
    }));
  };

  const startNewSession = () => {
    const newSession: GameSession = {
      id: v4(),
      date: new Date().toISOString(),
      players: gameState.players.map(player => ({ ...player, points: 0 })),
      completed: false,
    };

    setGameState(prev => ({
      ...prev,
      currentSession: newSession,
    }));
  };

  const endCurrentSession = () => {
    if (!gameState.currentSession) return;

    const loser = gameState.currentSession.players.reduce((prev, current) =>
      prev.points > current.points ? prev : current
    );

    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === loser.id
          ? { ...player, totalLosses: player.totalLosses + 1 }
          : player
      ),
      sessions: [...prev.sessions, { ...prev.currentSession!, completed: true }],
      currentSession: null,
    }));
  };

  const clearSessions = () => {
    setGameState(prev => ({
      ...prev,
      sessions: [],
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        addPlayer,
        removePlayer,
        updatePoints,
        startNewSession,
        endCurrentSession,
        clearSessions,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 