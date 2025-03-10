let players = JSON.parse(localStorage.getItem("players")) || [];
let playersPerTeam = parseInt(localStorage.getItem("playersPerTeam")) || 5;
let showButtons = false; // Estado inicial: botões ocultos
let previousState = null; // Armazena o estado anterior

// Função para salvar o estado atual
function saveState() {
  previousState = JSON.parse(JSON.stringify(players)); // Cria uma cópia profunda do estado atual
  updateUndoButtonVisibility(); // Atualiza a visibilidade do botão "Desfazer Última Ação"
}

// Função para desfazer a última ação
function undoLastAction() {
  if (previousState) {
    players = JSON.parse(JSON.stringify(previousState)); // Restaura o estado anterior
    localStorage.setItem("players", JSON.stringify(players));
    previousState = null; // Limpa o estado anterior
    updateUndoButtonVisibility(); // Atualiza a visibilidade do botão "Desfazer Última Ação"
    renderLists();
  } else {
    alert("Nenhuma ação para desfazer.");
  }
}

// Função para atualizar a visibilidade do botão "Desfazer Última Ação"
function updateUndoButtonVisibility() {
  const undoButton = document.getElementById("undoButton");
  if (undoButton) {
    undoButton.style.display = previousState ? "block" : "none";
  }
}

// Função para alternar a visibilidade dos botões
function toggleButtons() {
  showButtons = !showButtons;
  document.getElementById("toggleButtonText").textContent = showButtons
    ? "Ocultar Botões"
    : "Mostrar Botões";
  renderPlayerList();
}

// Função para adicionar um jogador
function addPlayer() {
  const playerName = document.getElementById("playerName").value.trim();
  if (playerName) {
    if (players.some((player) => player.name === playerName)) {
      alert("Jogador já cadastrado!");
      return;
    }

    // Encontra o índice do último jogador com checked: true
    const lastCheckedIndex = players.findIndex((player) => !player.checked);

    // Se não houver jogadores com checked: false, adiciona ao final
    const insertIndex =
      lastCheckedIndex === -1 ? players.length : lastCheckedIndex;

    // Insere o novo jogador na posição correta
    players.splice(insertIndex, 0, { name: playerName, checked: true });

    localStorage.setItem("players", JSON.stringify(players));
    document.getElementById("playerName").value = "";
    renderLists();
  } else {
    alert("Por favor, insira um nome válido.");
  }
}

// Função para renderizar todas as listas
function renderLists() {
  renderPlayerList();
  renderTeams();
}

// Função para mover o jogador para cima ou para baixo na lista
function movePlayer(index, direction) {
  if (
    (direction === -1 && index > 0) ||
    (direction === 1 && index < players.length - 1)
  ) {
    // saveState(); // Salva o estado antes de mover
    const temp = players[index];
    players[index] = players[index + direction];
    players[index + direction] = temp;
    localStorage.setItem("players", JSON.stringify(players));
    renderLists();
  }
}

// Função para alternar a seleção do jogador
function togglePlayerSelection(index) {
  // saveState(); // Salva o estado antes de alternar
  players[index].checked = !players[index].checked;
  localStorage.setItem("players", JSON.stringify(players));
  renderLists();
}

function togglePlayerSelection(index) {
  players[index].checked = !players[index].checked; // Alterna o estado
  localStorage.setItem("players", JSON.stringify(players)); // Salva a mudança
  reorderPlayers(); // Chama a função para reorganizar os jogadores
}

function togglePlayerSelection(index) {
  players[index].checked = !players[index].checked; // Alterna o estado do checkbox
  reorderPlayers(); // Chama a função para reorganizar os jogadores
}

// Função para renderizar a lista de jogadores
function renderPlayerList() {
  const playerList = document.getElementById("playerList");

  playerList.innerHTML = "";
  players.forEach((player, index) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex align-items-center justify-content-between";

    // Div para os botões de subir/descer
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "d-flex gap-1 me-3";

    if (showButtons) {
      const moveUpButton = document.createElement("button");
      moveUpButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
      moveUpButton.className = "btn btn-info btn-sm";
      moveUpButton.onclick = () => movePlayer(index, -1);

      const moveDownButton = document.createElement("button");
      moveDownButton.innerHTML = '<i class="fas fa-arrow-down"></i>';
      moveDownButton.className = "btn btn-info btn-sm";
      moveDownButton.onclick = () => movePlayer(index, 1);

      buttonDiv.appendChild(moveUpButton);
      buttonDiv.appendChild(moveDownButton);
    }

    // Div para checkbox e nome do jogador
    const playerInfoDiv = document.createElement("div");
    playerInfoDiv.className = "d-flex align-items-center flex-grow-1";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = player.checked;
    checkbox.className = "me-2";
    checkbox.onchange = () => togglePlayerSelection(index);

    const playerName = document.createElement("span");
    playerName.textContent = player.name;
    playerName.className = "fw-bold flex-grow-1";

    playerInfoDiv.appendChild(checkbox);
    playerInfoDiv.appendChild(playerName);

    // Div para os botões "Mover para Espera" e "Remover"
    const actionButtonsDiv = document.createElement("div");
    actionButtonsDiv.className = "d-flex gap-2";

    if (showButtons) {
      const moveButton = document.createElement("button");
      moveButton.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
      moveButton.className = "btn btn-secondary btn-sm";
      moveButton.onclick = () => moveToWaitingList(index);

      const removeButton = document.createElement("button");
      removeButton.innerHTML = '<i class="fas fa-trash"></i>';
      removeButton.className = "btn btn-danger btn-sm";
      removeButton.onclick = () => removePlayer(index);

      actionButtonsDiv.appendChild(moveButton);
      actionButtonsDiv.appendChild(removeButton);
    }

    li.appendChild(buttonDiv);
    li.appendChild(playerInfoDiv);
    li.appendChild(actionButtonsDiv);

    playerList.appendChild(li);
  });
}

// Função para renderizar os times e a lista de espera
function renderTeams() {
  const teamA = document.getElementById("teamA");
  const teamB = document.getElementById("teamB");
  const waitingList = document.getElementById("waitingList");
  const waitingListTitle = document.getElementById("waitingListTitle");

  teamA.innerHTML = "";
  teamB.innerHTML = "";
  waitingList.innerHTML = "";

  const selectedPlayers = players
    .filter((player) => player.checked)
    .map((player) => player.name);

  const teamSize = playersPerTeam;
  const teamAPlayers = selectedPlayers.slice(0, teamSize);
  const teamBPlayers = selectedPlayers.slice(teamSize, teamSize * 2);
  const waitingPlayers = selectedPlayers.slice(teamSize * 2);

  // Renderizar Time A
  for (let i = 0; i < teamSize; i++) {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = teamAPlayers[i] || "Aguardando jogador...";

    if (teamAPlayers[i]) {
      const substituteButton = document.createElement("button");
      substituteButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
      substituteButton.className = "btn btn-warning btn-sm";
      substituteButton.onclick = () => substitutePlayer("teamA", i);
      li.appendChild(substituteButton);
    }

    teamA.appendChild(li);
  }

  // Renderizar Time B
  for (let i = 0; i < teamSize; i++) {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = teamBPlayers[i] || "Aguardando jogador...";

    if (teamBPlayers[i]) {
      const substituteButton = document.createElement("button");
      substituteButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
      substituteButton.className = "btn btn-warning btn-sm";
      substituteButton.onclick = () => substitutePlayer("teamB", i);
      li.appendChild(substituteButton);
    }

    teamB.appendChild(li);
  }

  // Renderizar Lista de Espera
  if (waitingPlayers.length > 0) {
    waitingListTitle.style.display = "block";
    let waitingIndex = 1;
    for (let i = 0; i < waitingPlayers.length; i += teamSize) {
      const waitingTeam = waitingPlayers.slice(i, i + teamSize);
      const teamDiv = document.createElement("div");
      teamDiv.className = "list-group-item";
      teamDiv.innerHTML = `<strong>Próxima ${waitingIndex}:</strong> ${waitingTeam.join(
        ", "
      )}`;
      waitingList.appendChild(teamDiv);
      waitingIndex++;
    }
  } else {
    waitingListTitle.style.display = "none";
  }
}

function substitutePlayer(teamId, playerIndex) {
  saveState(); // Salva o estado antes da substituição

  const selectedPlayers = players
    .filter((player) => player.checked)
    .map((player) => player.name);

  const teamSize = playersPerTeam;
  const teamAPlayers = selectedPlayers.slice(0, teamSize);
  const teamBPlayers = selectedPlayers.slice(teamSize, teamSize * 2);
  const waitingPlayers = selectedPlayers.slice(teamSize * 2);
  const disabledPlayers = players.filter((player) => !player.checked);

  let teamPlayers = teamId === "teamA" ? teamAPlayers : teamBPlayers;
  const playerToSubstitute = teamPlayers[playerIndex];

  if (waitingPlayers.length > 0) {
    const substitutePlayer = waitingPlayers[0]; // Pega o primeiro jogador da lista de espera

    // Remove o jogador substituído do time e adiciona o substituto
    teamPlayers[playerIndex] = substitutePlayer;

    // Remove o substituto da lista de espera e adiciona o jogador substituído ao final
    waitingPlayers.shift();
    waitingPlayers.push(playerToSubstitute);

    // Atualiza a lista de jogadores
    let updatedPlayers =
      teamId === "teamA"
        ? [...teamPlayers, ...teamBPlayers, ...waitingPlayers]
        : [...teamAPlayers, ...teamPlayers, ...waitingPlayers];

    updatedPlayers = updatedPlayers.map((name) => ({ name, checked: true }));

    let list = [];
    // Agora, se houver jogadores em disabledPlayers, adicione-os à lista final
    if (disabledPlayers.length > 0) {
      list = [
        ...updatedPlayers,
        ...disabledPlayers // Adiciona disabledPlayers, se houver
      ];
    }

    players = list.length > 0 ? list : updatedPlayers;

    localStorage.setItem("players", JSON.stringify(players));
    renderLists();
  } else {
    alert("Não há jogadores na lista de espera para substituir.");
  }
}
function reorderPlayers() {
  // Primeiro, separa os jogadores em dois grupos: marcados e não marcados
  players = players.sort((a, b) => {
    return b.checked - a.checked; // True (1) vem antes de False (0)
  });

  // Salva no localStorage
  localStorage.setItem("players", JSON.stringify(players));
  renderPlayerList(); // Re-renderiza a lista com a nova ordem
}

function uncheckAllPlayers() {
  document
    .querySelectorAll('#playerList input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.checked = false;
    });

  // Atualiza o estado dos jogadores no array e salva no localStorage
  players.forEach((player) => (player.checked = false));
  localStorage.setItem("players", JSON.stringify(players));

  reorderPlayers(); // Reorganiza a lista com os valores atualizados
}

// Função para mover um jogador para a lista de espera
function moveToWaitingList(index) {
  saveState(); // Salva o estado antes de mover
  const player = players.splice(index, 1)[0];
  players.push(player);
  localStorage.setItem("players", JSON.stringify(players));
  renderLists();
}

// Função para remover um jogador
function removePlayer(index) {
  // saveState(); // Salva o estado antes de remover
  players.splice(index, 1);
  localStorage.setItem("players", JSON.stringify(players));
  renderLists();
}

// Função para indicar que um time perdeu
function teamLost(teamId) {
  saveState(); // Salva o estado antes de marcar o time perdedor

  // Recupera a lista de jogadores do localStorage (já como objetos com 'name' e 'checked')
  const allPlayers = JSON.parse(localStorage.getItem("players"));

  // Divide a lista de jogadores em times A e B e reserva
  const teamAPlayers = allPlayers.slice(0, playersPerTeam); // Jogadores do time A
  const teamBPlayers = allPlayers.slice(playersPerTeam, playersPerTeam * 2); // Jogadores do time B
  const reservePlayers = allPlayers.slice(playersPerTeam * 2); // Jogadores da reserva

  // Definir variáveis para armazenar os jogadores que perderam
  let losingPlayers, updatedReservePlayers;

  // Verifica qual time perdeu e organiza a troca corretamente
  if (teamId === "teamA") {
    losingPlayers = teamAPlayers;
    updatedReservePlayers = reservePlayers.slice(losingPlayers.length); // Atualiza a reserva
  } else if (teamId === "teamB") {
    losingPlayers = teamBPlayers;
    updatedReservePlayers = reservePlayers.slice(losingPlayers.length); // Atualiza a reserva
  }

  // Substitui o time perdido pelos jogadores da reserva e move os jogadores perdedores para o final
  let updatedPlayers = [];

  if (teamId === "teamA") {
    updatedPlayers = [
      ...reservePlayers.slice(0, playersPerTeam), // Substitui os jogadores do time A com os da reserva
      ...teamBPlayers, // Mantém o time B inalterado
      ...updatedReservePlayers, // Coloca o restante da reserva
      ...losingPlayers // Coloca os perdedores no final
    ];
  } else if (teamId === "teamB") {
    updatedPlayers = [
      ...teamAPlayers, // Mantém o time A inalterado
      ...reservePlayers.slice(0, playersPerTeam), // Substitui os jogadores do time B com os da reserva
      ...updatedReservePlayers, // Coloca o restante da reserva
      ...losingPlayers // Coloca os perdedores no final
    ];
  }

  players = updatedPlayers;
  // Salva a lista atualizada no localStorage
  localStorage.setItem("players", JSON.stringify(players));
  console.log(updatedPlayers); // Para verificar a lista de jogadores

  // Chama renderLists e faz a verificação
  renderLists();
}

// Função para mesclar os times
function mergeTeams() {
  saveState(); // Salva o estado antes de sortear
  const teamAPlayers = Array.from(
    document.getElementById("teamA").children
  ).map((li) => li.textContent);
  const teamBPlayers = Array.from(
    document.getElementById("teamB").children
  ).map((li) => li.textContent);
  const allPlayers = teamAPlayers
    .concat(teamBPlayers)
    .sort(() => Math.random() - 0.5);

  players = allPlayers
    .map((name) => ({ name, checked: true }))
    .concat(players.filter((player) => !allPlayers.includes(player.name)));
  localStorage.setItem("players", JSON.stringify(players));
  renderLists();
}

// Função para atualizar o número de jogadores por time
function updateTeams() {
  const newPlayersPerTeam = parseInt(
    document.getElementById("playersPerTeam").value
  );
  if (newPlayersPerTeam > 0) {
    // saveState(); // Salva o estado antes de atualizar
    playersPerTeam = newPlayersPerTeam;
    localStorage.setItem("playersPerTeam", playersPerTeam);
    renderLists();
  } else {
    alert("Por favor, insira um número válido de jogadores por time.");
  }
}

// Função para exportar a lista de jogadores
function exportPlayers() {
  if (players.length > 0) {
    const dataStr = JSON.stringify(players, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jogadores.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    alert("Nenhum jogador para exportar.");
  }
}

// Função para importar a lista de jogadores
function importPlayers() {
  document.getElementById("importFileInput").click();
}

// Função para lidar com a importação de arquivo
function handleFileImport(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedPlayers = JSON.parse(e.target.result);
        if (Array.isArray(importedPlayers)) {
          // saveState(); // Salva o estado antes de importar
          players = importedPlayers;
          localStorage.setItem("players", JSON.stringify(players));
          renderLists();
          updateExportButtonVisibility();
          alert("Jogadores importados com sucesso!");
        } else {
          alert("O arquivo não contém uma lista válida de jogadores.");
        }
      } catch (error) {
        alert("Erro ao importar jogadores. Verifique o arquivo.");
      }
    };
    reader.readAsText(file);
  }
}

// Função para atualizar a visibilidade do botão de exportar
function updateExportButtonVisibility() {
  const exportButton = document.getElementById("exportButton");
  if (exportButton) {
    exportButton.style.display = players.length > 0 ? "inline-block" : "none";
  }
}

// Atualize a visibilidade do botão de exportar ao carregar a página e após alterações na lista
document.addEventListener("DOMContentLoaded", updateExportButtonVisibility);

// Função para remover todos os jogadores
function clearAllPlayers() {
  // saveState(); // Salva o estado antes de remover todos
  players = [];
  localStorage.removeItem("players");
  renderLists();
}

// Inicialização
document.getElementById("playersPerTeam").value =
  localStorage.getItem("playersPerTeam") || 5;
renderLists();
updateUndoButtonVisibility(); // Atualiza a visibilidade do botão "Desfazer Última Ação" ao carregar a página
