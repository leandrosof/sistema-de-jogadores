"use client";
import { useRef } from "react";

export default function ConfigPanel({
  playersPerTeam,
  setPlayersPerTeam,
  players,
  setPlayers
}) {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(players, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `nucleofc-jogadores-${new Date().toLocaleDateString()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        const importedPlayers = JSON.parse(e.target.result);
        if (Array.isArray(importedPlayers)) {
          setPlayers(importedPlayers);
          alert("Jogadores importados com sucesso!");
        } else {
          alert("Formato de arquivo inválido!");
        }
      } catch (error) {
        alert("Erro ao importar jogadores!");
      }
    };
  };

  const clearAllPlayers = () => {
    if (confirm("Tem certeza que deseja remover TODOS os jogadores?")) {
      setPlayers([]);
    }
  };

  return (
    <div className="config-panel mt-4">
      <h3 className="mb-4">Configurações</h3>

      <div className="config-option">
        <label className="form-label">Jogadores por time:</label>
        <input
          type="number"
          min="1"
          className="form-control"
          value={playersPerTeam}
          onChange={(e) => setPlayersPerTeam(parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="config-option mt-4">
        <h5>Importar/Exportar</h5>
        <div className="d-flex flex-wrap">
          <button
            onClick={handleExport}
            className="btn btn-import-export"
            disabled={players.length === 0}
          >
            <i className="fas fa-file-export me-2"></i>Exportar
          </button>

          <button
            onClick={() => fileInputRef.current.click()}
            className="btn btn-import-export"
          >
            <i className="fas fa-file-import me-2"></i>Importar
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="config-option mt-4">
        <h5>Limpar Dados</h5>
        <button
          onClick={clearAllPlayers}
          className="btn btn-danger"
          disabled={players.length === 0}
        >
          <i className="fas fa-trash-alt me-2"></i>Limpar Todos os Jogadores
        </button>
      </div>
    </div>
  );
}
