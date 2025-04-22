"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRandom,
  faFlag,
  faSyncAlt,
  faUndo
} from "@fortawesome/free-solid-svg-icons";

import { useState, useEffect, useRef } from "react";

export default function TeamManagement({
  players,
  setPlayers,
  playersPerTeam
}) {
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [reserves, setReserves] = useState([]);
  const [deselectedPlayers, setDeselectedPlayers] = useState([]);
  const history = useRef([]);
  const currentIndex = useRef(-1);

  useEffect(() => {
    const selectedPlayers = players.filter((p) => p.checked);
    setDeselectedPlayers(players.filter((p) => !p.checked));
    setTeamA(selectedPlayers.slice(0, playersPerTeam));
    setTeamB(selectedPlayers.slice(playersPerTeam, playersPerTeam * 2));
    setReserves(selectedPlayers.slice(playersPerTeam * 2));
  }, [players, playersPerTeam]);

  // Monitora mudanças em players e salva no histórico
  useEffect(() => {
    // Não salva no primeiro render
    if (currentIndex.current === -1) {
      currentIndex.current = 0;
      history.current = [players];
      return;
    }

    // Salva apenas se realmente mudou
    if (
      JSON.stringify(players) !==
      JSON.stringify(history.current[currentIndex.current])
    ) {
      // Descarta "futuros" se estamos no meio do histórico
      history.current = history.current.slice(0, currentIndex.current + 1);
      history.current.push(players);
      currentIndex.current++;
    }
  }, [players]);

  const undoLastAction = () => {
    if (currentIndex.current <= 0) return; // Não pode desfazer além do inicial

    currentIndex.current--;
    setPlayers(history.current[currentIndex.current]);
  };

  const handleTeamLost = (lostTeam) => {
    if (reserves.length === 0) {
      alert("Não há jogadores reservas suficientes!");
      return;
    }

    const newReserves = [...reserves];
    const newTeamA = [...teamA];
    const newTeamB = [...teamB];
    let newPlayers = []; // Variável para armazenar os jogadores substituídos

    if (lostTeam === "A") {
      // Time A perdeu - vai para o final das reservas
      const lostPlayers = newTeamA.splice(0, playersPerTeam);
      newReserves.push(...lostPlayers);

      // Pega novos jogadores das reservas
      newPlayers = newReserves.splice(0, playersPerTeam);
      setTeamA(newPlayers); // Atualiza o Time A com os novos jogadores
    } else {
      // Time B perdeu - vai para o final das reservas
      const lostPlayers = newTeamB.splice(0, playersPerTeam);
      newReserves.push(...lostPlayers);

      // Pega novos jogadores das reservas
      newPlayers = newReserves.splice(0, playersPerTeam);
      setTeamB(newPlayers); // Atualiza o Time B com os novos jogadores
    }

    // Atualiza a lista de jogadores (players) com os times e reservas modificados
    setPlayers([
      ...(lostTeam === "A" ? newPlayers : newTeamA), // Time A atualizado
      ...(lostTeam === "B" ? newPlayers : newTeamB), // Time B atualizado
      ...newReserves, // Reservas atualizadas
      ...players.filter((p) => !p.checked) // Jogadores não selecionados
    ]);

    setReserves(newReserves); // Atualiza as reservas
  };

  const sortTeamsOnly = () => {
    // Junta os jogadores de teamA e teamB
    const combined = [...teamA, ...teamB];

    // Embaralha só esses jogadores
    const shuffled = [...combined].sort(() => Math.random() - 0.5);

    // Separa novamente entre A e B
    const newTeamA = shuffled.slice(0, playersPerTeam);
    const newTeamB = shuffled.slice(playersPerTeam, playersPerTeam * 2);

    // Atualiza os times
    setTeamA(newTeamA);
    setTeamB(newTeamB);

    setPlayers([...newTeamA, ...newTeamB, ...reserves, ...deselectedPlayers]);
  };

  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Gerenciamento de Times</h3>
        <div>
          {currentIndex.current > 0 && (
            <button
              onClick={undoLastAction}
              className="btn btn-secondary me-2"
              title="Desfazer última ação"
            >
              <FontAwesomeIcon icon={faUndo} className="me-2" /> Desfazer
            </button>
          )}
          <button onClick={sortTeamsOnly} className="btn btn-primary me-2">
            <FontAwesomeIcon icon={faRandom} className="me-2" /> Sortear A x B
          </button>
          <button
            onClick={() => handleTeamLost("A")}
            className="btn btn-lost me-2"
            disabled={reserves.length === 0}
          >
            <FontAwesomeIcon icon={faFlag} className="me-2" /> Time A Perdeu
          </button>
          <button
            onClick={() => handleTeamLost("B")}
            className="btn btn-lost"
            disabled={reserves.length === 0}
          >
            <FontAwesomeIcon icon={faFlag} className="me-2" /> Time B Perdeu
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h4 className="text-center text-success">Time A</h4>
            <ul className="list-group">
              {teamA.map((player, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span>{player?.name || "Vaga"}</span>
                  {reserves.length > 0 && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        const newReserves = [...reserves];
                        const substitute = newReserves.shift();
                        const newTeamA = [...teamA];
                        newReserves.push(newTeamA[index]);
                        newTeamA[index] = substitute;
                        setTeamA(newTeamA);
                        setReserves(newReserves);
                        setPlayers([
                          ...newTeamA,
                          ...teamB,
                          ...newReserves,
                          ...deselectedPlayers
                        ]);
                      }}
                    >
                      <FontAwesomeIcon icon={faSyncAlt} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-6">
            <h4 className="text-center text-success">Time B</h4>
            <ul className="list-group">
              {teamB.map((player, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span>{player?.name || "Vaga"}</span>
                  {reserves.length > 0 && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        const newReserves = [...reserves];
                        const substitute = newReserves.shift();
                        const newTeamB = [...teamB];
                        newReserves.push(newTeamB[index]);
                        newTeamB[index] = substitute;
                        setTeamB(newTeamB);
                        setReserves(newReserves);
                        setPlayers([
                          ...teamA,
                          ...newTeamB,
                          ...newReserves,
                          ...deselectedPlayers
                        ]);
                      }}
                    >
                      <FontAwesomeIcon icon={faSyncAlt} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {reserves.length > 0 && (
          <div className="mt-4">
            <h4>Reservas</h4>
            <div className="flex flex-col gap-4">
              {/* flex-col para exibir os times um abaixo do outro */}
              {Array.from({
                length: Math.ceil(reserves.length / playersPerTeam)
              }).map((_, teamIndex) => {
                // Começando a partir do time C (index 2)
                const teamName = String.fromCharCode(67 + teamIndex); // 'C' começa no código 67 ASCII

                // Pegando os jogadores para o time atual
                const teamPlayers = reserves.slice(
                  teamIndex * playersPerTeam,
                  (teamIndex + 1) * playersPerTeam
                );

                return (
                  <div
                    key={teamIndex}
                    className="mb-4 p-4 border rounded-lg shadow-sm bg-gray-50"
                  >
                    {/* Exibindo o nome do time e os jogadores */}
                    <span className="text-xl font-semibold text-blue-600">
                      Time {teamName}:{" "}
                    </span>
                    <div className="mt-2 text-gray-700">
                      {teamPlayers
                        .map((player, index) => player.name)
                        .join(", ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
