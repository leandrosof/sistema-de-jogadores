import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PlayerList({ players, setPlayers }) {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [showButtons, setShowButtons] = useState(false);

  // Adiciona novo jogador mantendo a ordem de chegada
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

    const newPlayer = {
      name,
      checked: true,
      createdAt: new Date().getTime()
    };

    setPlayers([
      ...players.filter((p) => p.checked),
      newPlayer,
      ...players.filter((p) => !p.checked)
    ]);

    toast.success(`Jogador "${name}" adicionado com sucesso!`);
    setNewPlayerName("");
  };

  // Alterna seleção mantendo a ordem original
  const togglePlayer = (index) => {
    const playerToToggle = players[index];
    const newPlayers = players.map((p) => ({
      ...p,
      // Mantém a ordem original usando createdAt para desmarcados
      sortKey:
        p.checked === playerToToggle.checked ? p.createdAt : p.checked ? 1 : -1
    }));

    const updatedPlayers = newPlayers.map((p) =>
      p.name === playerToToggle.name ? { ...p, checked: !p.checked } : p
    );

    // Ordena: checked primeiro, depois pela ordem de chegada
    setPlayers(
      updatedPlayers.sort((a, b) => {
        if (a.checked !== b.checked) return b.checked - a.checked;
        return a.createdAt - b.createdAt;
      })
    );
  };

  // Move jogador para cima (mantendo a ordem relativa)
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

  // Move jogador para baixo (mantendo a ordem relativa)
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

  // Move jogador para o final do seu grupo (checked/unchecked)
  const movePlayerToEnd = (index) => {
    const player = players[index];
    const newPlayers = players.filter((p) => p.name !== player.name);
    const targetGroup = player.checked
      ? newPlayers.filter((p) => p.checked)
      : newPlayers.filter((p) => !p.checked);

    setPlayers([
      ...newPlayers.filter((p) => p.checked && p.name !== player.name),
      ...(player.checked ? [player] : []),
      ...newPlayers.filter((p) => !p.checked && p.name !== player.name),
      ...(!player.checked ? [player] : [])
    ]);
  };

  // Remove jogador
  const removePlayer = (index) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  // Desmarca todos mantendo a ordem
  const uncheckAllPlayers = () => {
    setPlayers(players.map((player) => ({ ...player, checked: false })));
  };

  // Agrupa jogadores por status checked mantendo a ordem relativa
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.checked !== b.checked) return b.checked - a.checked;
    return a.createdAt - b.createdAt;
  });

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
          onClick={(e) => e.key === "Enter" && addPlayer()}
        />
        <button
          onClick={addPlayer}
          className="btn btn-nucleo btn-nucleo-primary d-flex align-items-center justify-content-center"
        >
          <i className="fas fa-plus text-white"></i>
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
                <i className="fas fa-eye-slash me-1"></i> Ocultar Ações
              </>
            ) : (
              <>
                <i className="fas fa-eye me-1"></i> Mostrar Ações
              </>
            )}
          </button>
          <button
            onClick={uncheckAllPlayers}
            className="btn btn-warning btn-sm"
          >
            <i className="fas fa-times-circle me-1"></i> Desmarcar Todos
          </button>
        </div>
      </div>

      <ul className="list-group">
        {sortedPlayers.map((player, index) => (
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
                onChange={() =>
                  togglePlayer(players.findIndex((p) => p.name === player.name))
                }
                className="form-check-input me-3"
                style={{ transform: "scale(1.3)" }}
              />
              <span className="h5 mb-0">{player.name}</span>
            </div>

            {showButtons && (
              <div className="d-flex gap-2">
                <button
                  onClick={() =>
                    movePlayerUp(
                      players.findIndex((p) => p.name === player.name)
                    )
                  }
                  className="btn btn-info btn-sm"
                  title="Mover para cima"
                  disabled={
                    index === 0 ||
                    player.checked !== sortedPlayers[index - 1].checked
                  }
                >
                  <i className="fas fa-arrow-up"></i>
                </button>
                <button
                  onClick={() =>
                    movePlayerDown(
                      players.findIndex((p) => p.name === player.name)
                    )
                  }
                  className="btn btn-info btn-sm"
                  title="Mover para baixo"
                  disabled={
                    index === sortedPlayers.length - 1 ||
                    player.checked !== sortedPlayers[index + 1].checked
                  }
                >
                  <i className="fas fa-arrow-down"></i>
                </button>
                <button
                  onClick={() =>
                    movePlayerToEnd(
                      players.findIndex((p) => p.name === player.name)
                    )
                  }
                  className="btn btn-secondary btn-sm"
                  title="Mover para o final do grupo"
                >
                  <i className="fas fa-sign-in-alt"></i>
                </button>
                <button
                  onClick={() =>
                    removePlayer(
                      players.findIndex((p) => p.name === player.name)
                    )
                  }
                  className="btn btn-danger btn-sm"
                  title="Remover jogador"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
