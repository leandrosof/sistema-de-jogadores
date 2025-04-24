"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEye,
  faEyeSlash,
  faTimesCircle,
  faArrowUp,
  faArrowDown,
  faSignInAlt,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

export default function PlayerList({ players, setPlayers, playersPerTeam }) {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [showButtons, setShowButtons] = useState(false);

  const addPlayer = () => {
    const name = newPlayerName.trim();

    if (!name) {
      toast.warning("Por favor, digite um nome válido");
      return;
    }

    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      toast.error(`O jogador "${name}" já está cadastrado!`);
      return;
    }

    const newPlayer = { name, checked: true };

    // adiciona após o último checked
    const lastCheckedIndex = [...players]
      .map((p, i) => (p.checked ? i : -1))
      .filter((i) => i !== -1)
      .pop();

    if (lastCheckedIndex !== undefined && lastCheckedIndex >= 0) {
      const before = players.slice(0, lastCheckedIndex + 1);
      const after = players.slice(lastCheckedIndex + 1);
      setPlayers([...before, newPlayer, ...after]);
    } else {
      // nenhum checked, adiciona no início
      setPlayers([newPlayer, ...players]);
    }

    toast.success(`Jogador "${name}" adicionado com sucesso!`);
    setNewPlayerName("");
  };

  const togglePlayer = (index) => {
    const updated = [...players];
    const toggled = { ...updated[index], checked: !updated[index].checked };
    updated.splice(index, 1); // remove do local atual

    if (toggled.checked) {
      // move para o final do grupo checked
      const lastCheckedIndex = updated
        .map((p, i) => (p.checked ? i : -1))
        .filter((i) => i !== -1)
        .pop();
      if (lastCheckedIndex !== undefined) {
        updated.splice(lastCheckedIndex + 1, 0, toggled);
      } else {
        updated.unshift(toggled); // nenhum checked, vai pro início
      }
    } else {
      // move para o final do grupo unchecked
      updated.push(toggled);
    }

    setPlayers(updated);
  };

  const movePlayerUp = (index) => {
    if (index > 0 && players[index].checked === players[index - 1].checked) {
      const newPlayers = [...players];
      [newPlayers[index], newPlayers[index - 1]] = [
        newPlayers[index - 1],
        newPlayers[index]
      ];
      setPlayers(newPlayers);
    }
  };

  const movePlayerDown = (index) => {
    if (
      index < players.length - 1 &&
      players[index].checked === players[index + 1].checked
    ) {
      const newPlayers = [...players];
      [newPlayers[index], newPlayers[index + 1]] = [
        newPlayers[index + 1],
        newPlayers[index]
      ];
      setPlayers(newPlayers);
    }
  };

  const movePlayerToEnd = (index) => {
    const player = players[index];
    const newPlayers = [...players];
    newPlayers.splice(index, 1); // remove o jogador atual

    let newIndex;

    if (player.checked) {
      const lastCheckedIndex = newPlayers
        .map((p, i) => (p.checked ? i : -1))
        .filter((i) => i !== -1)
        .pop();

      newIndex = lastCheckedIndex !== undefined ? lastCheckedIndex + 1 : 0;
      newPlayers.splice(newIndex, 0, player);
    } else {
      newPlayers.push(player);
      newIndex = newPlayers.length - 1;
    }

    // só atualiza se a posição mudar
    if (index !== newIndex) {
      setPlayers(newPlayers);
    }
  };

  const removePlayer = (index) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const uncheckAllPlayers = () => {
    setPlayers(players.map((p) => ({ ...p, checked: false })));
  };

  return (
    <div className="mt-3">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Nome do Jogador"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPlayer()}
        />
        <button
          onClick={addPlayer}
          className="btn d-flex align-items-center justify-content-center bg-success"
        >
          <FontAwesomeIcon icon={faPlus} className="text-white" />
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Lista de Jogadores</h2>
        <div>
          <button
            onClick={() => setShowButtons(!showButtons)}
            className="btn btn-secondary btn-sm me-2"
          >
            {showButtons ? (
              <>
                <FontAwesomeIcon icon={faEyeSlash} className="me-1" />
                Ações
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faEye} className="me-1" /> Ações
              </>
            )}
          </button>
          {showButtons && (
            <button
              onClick={uncheckAllPlayers}
              className="btn btn-warning btn-sm"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
              Desmarcar Todos
            </button>
          )}
        </div>
      </div>

      <ul className="list-group">
        {players.map((player, index) => (
          <li
            key={`${player.name}-${index}`}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              player.checked ? "bg-light" : ""
            }`}
          >
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                checked={player.checked}
                onChange={() => togglePlayer(index)}
                className="form-check-input me-3"
                style={{ transform: "scale(1.3)" }}
              />
              <span className="h5 mb-0">{player.name}</span>
            </div>

            {showButtons && (
              <div className="d-flex gap-2">
                <button
                  onClick={() => movePlayerUp(index)}
                  className="btn btn-info btn-sm"
                  title="Mover para cima"
                  disabled={
                    index === 0 || player.checked !== players[index - 1].checked
                  }
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button
                  onClick={() => movePlayerDown(index)}
                  className="btn btn-info btn-sm"
                  title="Mover para baixo"
                  disabled={
                    index === players.length - 1 ||
                    player.checked !== players[index + 1]?.checked
                  }
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
                <button
                  onClick={() => movePlayerToEnd(index)}
                  className="btn btn-secondary btn-sm"
                  title="Mover para o final do grupo"
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                </button>
                <button
                  onClick={() => removePlayer(index)}
                  className="btn btn-danger btn-sm"
                  title="Remover jogador"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
