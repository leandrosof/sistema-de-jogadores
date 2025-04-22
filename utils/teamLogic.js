"use client";

export const shufflePlayers = (players) => {
  const shuffled = [...players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const balanceTeams = (players, teamSize) => {
  const shuffled = shufflePlayers(players.filter((p) => p.checked));
  return {
    teamA: shuffled.slice(0, teamSize),
    teamB: shuffled.slice(teamSize, teamSize * 2),
    reserves: shuffled.slice(teamSize * 2)
  };
};
