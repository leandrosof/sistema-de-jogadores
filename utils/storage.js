"use client";

export const savePlayers = (players) => {
  localStorage.setItem("players", JSON.stringify(players));
};

export const loadPlayers = () => {
  return JSON.parse(localStorage.getItem("players")) || [];
};

export const saveTeamSize = (size) => {
  localStorage.setItem("playersPerTeam", size.toString());
};

export const loadTeamSize = () => {
  return parseInt(localStorage.getItem("playersPerTeam")) || 5;
};
