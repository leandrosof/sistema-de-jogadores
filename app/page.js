"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import PlayerList from "@/components/PlayerList";
import TeamManagement from "@/components/TeamManagement";
import ConfigPanel from "@/components/ConfigPanel";
import {
  loadPlayers,
  savePlayers,
  loadTeamSize,
  saveTeamSize
} from "@/utils/storage";

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [playersPerTeam, setPlayersPerTeam] = useState(5);
  const [activeTab, setActiveTab] = useState("players");

  useEffect(() => {
    setPlayers(loadPlayers());
    setPlayersPerTeam(loadTeamSize());
  }, []);

  useEffect(() => savePlayers(players), [players]);
  useEffect(() => saveTeamSize(playersPerTeam), [playersPerTeam]);

  return (
    <main>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "players" ? "active" : ""}`}
            onClick={() => setActiveTab("players")}
          >
            <i className="fas fa-users me-2"></i>Jogadores
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            <i className="fas fa-shield-alt me-2"></i>Times
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "config" ? "active" : ""}`}
            onClick={() => setActiveTab("config")}
          >
            <i className="fas fa-cog me-2"></i>Configurações
          </button>
        </li>
      </ul>

      <div className="container mt-3">
        {activeTab === "players" && (
          <PlayerList players={players} setPlayers={setPlayers} />
        )}

        {activeTab === "teams" && (
          <TeamManagement
            players={players}
            setPlayers={setPlayers}
            playersPerTeam={playersPerTeam}
          />
        )}

        {activeTab === "config" && (
          <ConfigPanel
            playersPerTeam={playersPerTeam}
            setPlayersPerTeam={setPlayersPerTeam}
            players={players}
            setPlayers={setPlayers}
          />
        )}
      </div>
    </main>
  );
}
