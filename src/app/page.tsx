'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGame } from '@/context/GameContext';

export default function Home() {
  const {
    gameState,
    addPlayer,
    removePlayer,
    updatePoints,
    startNewSession,
    endCurrentSession,
    clearSessions,
  } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [pointsToAdd, setPointsToAdd] = useState<{ [key: string]: string }>({});

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handlePointsSubmit = () => {
    if (gameState.currentSession) {
      // Process points for all players
      gameState.currentSession.players.forEach(player => {
        const points = parseInt(pointsToAdd[player.id] || '0');
        if (!isNaN(points)) {
          updatePoints(player.id, points);
        }
      });
      // Reset all pointsToAdd inputs
      setPointsToAdd({});
    }
  };

  // Bull head icon component for decoration
  const BullHead = () => (
    <div className="text-secondary text-xl sm:text-2xl font-bold">
      🐂
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container px-3 sm:px-4 py-2 mx-auto max-w-full sm:max-w-6xl">
        <div className="flex flex-col items-center justify-center py-4 sm:py-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-1 sm:mb-2 text-primary">6 Nimmt!</h1>
          <p className="text-base sm:text-lg text-secondary mb-4 sm:mb-8 font-medium">Score Tracker</p>
          
          <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-8">
            <BullHead />
            <BullHead />
            <BullHead />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-8 w-full mx-auto">
          {/* Add Player Form */}
          <Card className="border-2 border-accent/30 shadow-lg">
            <CardHeader className="bg-secondary text-secondary-foreground py-3 sm:py-6">
              <CardTitle className="text-base sm:text-xl">Add New Player</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-4">
              <form onSubmit={handleAddPlayer} className="flex gap-2">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Player name"
                  className="flex-1 border-secondary/30"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                  Add Player
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Session */}
          <Card className="border-2 border-secondary/30 shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground py-3 sm:py-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                <span>Current Game</span>
                <BullHead />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6 pb-4">
              {!gameState.currentSession ? (
                <Button
                  onClick={startNewSession}
                  disabled={gameState.players.length < 2}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                >
                  Start New Game
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto -mx-2 px-2">
                    <Table className="w-full">
                      <TableHeader className="bg-secondary/10">
                        <TableRow>
                          <TableHead className="text-foreground font-bold text-sm sm:text-base">Player</TableHead>
                          <TableHead className="text-foreground font-bold text-sm sm:text-base">Points</TableHead>
                          <TableHead className="text-foreground font-bold text-sm sm:text-base">Add Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gameState.currentSession.players.map((player) => (
                          <TableRow key={player.id} className="hover:bg-accent/5">
                            <TableCell className="font-medium text-xs sm:text-sm py-2">{player.name}</TableCell>
                            <TableCell className="font-bold text-primary text-xs sm:text-sm py-2">{player.points}</TableCell>
                            <TableCell className="py-2">
                              <Input
                                type="number"
                                value={pointsToAdd[player.id] || ''}
                                onChange={(e) =>
                                  setPointsToAdd(prev => ({
                                    ...prev,
                                    [player.id]: e.target.value,
                                  }))
                                }
                                placeholder="Points"
                                className="w-full border-secondary/30 text-xs sm:text-sm"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-4">
                    <Button 
                      onClick={handlePointsSubmit} 
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs sm:text-sm"
                    >
                      Add Points
                    </Button>
                    <Button 
                      onClick={endCurrentSession} 
                      variant="outline" 
                      className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs sm:text-sm"
                    >
                      End Game
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Player Stats */}
          <Card className="border-2 border-primary/30 shadow-lg">
            <CardHeader className="bg-accent text-accent-foreground py-3 sm:py-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                <span>Player Statistics</span>
                <BullHead />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6 pb-4">
              <div className="overflow-x-auto -mx-2 px-2">
                <Table className="w-full">
                  <TableHeader className="bg-accent/10">
                    <TableRow>
                      <TableHead className="text-foreground font-bold text-sm sm:text-base">Player</TableHead>
                      <TableHead className="text-foreground font-bold text-sm sm:text-base">Total Losses</TableHead>
                      <TableHead className="text-foreground font-bold text-sm sm:text-base">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gameState.players.map((player) => (
                      <TableRow key={player.id} className="hover:bg-primary/5">
                        <TableCell className="font-medium text-xs sm:text-sm py-2">{player.name}</TableCell>
                        <TableCell className="font-bold text-secondary text-xs sm:text-sm py-2">{player.totalLosses}</TableCell>
                        <TableCell className="py-2">
                          <Button
                            onClick={() => removePlayer(player.id)}
                            variant="destructive"
                            size="sm"
                            className="bg-destructive hover:bg-destructive/90 text-xs sm:text-sm px-2 h-8"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Game History */}
          {gameState.sessions.length > 0 && (
            <Card className="border-2 border-secondary/30 shadow-lg mb-6 sm:mb-10">
              <CardHeader className="bg-secondary text-secondary-foreground py-3 sm:py-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
                  <span>Game History</span>
                  <BullHead />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 px-2 sm:px-6 pb-4">
                <div className="overflow-x-auto -mx-2 px-2">
                  <Table className="w-full">
                    <TableHeader className="bg-secondary/10">
                      <TableRow>
                        <TableHead className="text-foreground font-bold text-sm sm:text-base">Date</TableHead>
                        <TableHead className="text-foreground font-bold text-sm sm:text-base">Players</TableHead>
                        <TableHead className="text-foreground font-bold text-sm sm:text-base">Loser</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gameState.sessions.map((session) => {
                        const loser = session.players.reduce((prev, current) =>
                          prev.points > current.points ? prev : current
                        );
                        return (
                          <TableRow key={session.id} className="hover:bg-primary/5">
                            <TableCell className="text-xs sm:text-sm py-2">
                              {new Date(session.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm py-2 truncate max-w-[120px] sm:max-w-none">
                              {session.players.map(p => p.name).join(', ')}
                            </TableCell>
                            <TableCell className="font-bold text-xs sm:text-sm py-2">
                              {loser.name} <span className="text-primary">({loser.points} points)</span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="px-2 sm:px-6 pb-4 pt-0">
                <Button 
                  onClick={clearSessions} 
                  variant="outline" 
                  className="w-full border-destructive text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
                >
                  Clear History
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
