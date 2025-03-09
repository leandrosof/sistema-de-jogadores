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
    saveState(); // Salva o estado antes de adicionar
    players.push({ name: playerName, checked: true });
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
    saveState(); // Salva o estado antes de mover
    const temp = players[index];
    players[index] = players[index + direction];
    players[index + direction] = temp;
    localStorage.setItem("players", JSON.stringify(players));
    renderLists();
  }
}

// Função para alternar a seleção do jogador
function togglePlayerSelection(index) {
  saveState(); // Salva o estado antes de alternar
  players[index].checked = !players[index].checked;
  localStorage.setItem("players", JSON.stringify(players));
  renderLists();
}

// Função para renderizar a lista de jogadores
function renderPlayerList() {
  const playerList = document.getElementById("playerList");
  const removeAllButton = document.querySelector(
    "button[onclick='clearAllPlayers()']"
  );

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

  if (removeAllButton) {
    removeAllButton.style.display = showButtons ? "block" : "none";
  }
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

  for (let i = 0; i < teamSize; i++) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = teamAPlayers[i] || "Aguardando jogador...";
    teamA.appendChild(li);
  }

  for (let i = 0; i < teamSize; i++) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = teamBPlayers[i] || "Aguardando jogador...";
    teamB.appendChild(li);
  }

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
  saveState(); // Salva o estado antes de remover
  players.splice(index, 1);
  localStorage.setItem("players", JSON.stringify(players));
  renderLists();
}

// Função para indicar que um time perdeu
function teamLost(teamId) {
  saveState(); // Salva o estado antes de marcar o time perdedor
  const team = document.getElementById(teamId);
  const teamPlayers = Array.from(team.children).map((li) => li.textContent);
  players = players
    .filter((player) => !teamPlayers.includes(player.name))
    .concat(teamPlayers.map((name) => ({ name, checked: true })));
  localStorage.setItem("players", JSON.stringify(players));
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
    saveState(); // Salva o estado antes de atualizar
    playersPerTeam = newPlayersPerTeam;
    localStorage.setItem("playersPerTeam", playersPerTeam);
    renderLists();
  } else {
    alert("Por favor, insira um número válido de jogadores por time.");
  }
}

// Função para remover todos os jogadores
function clearAllPlayers() {
  saveState(); // Salva o estado antes de remover todos
  players = [];
  localStorage.removeItem("players");
  renderLists();
}

// Inicialização
document.getElementById("playersPerTeam").value =
  localStorage.getItem("playersPerTeam") || 5;
renderLists();
updateUndoButtonVisibility(); // Atualiza a visibilidade do botão "Desfazer Última Ação" ao carregar a página
