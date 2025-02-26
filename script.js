let players = JSON.parse(localStorage.getItem("players")) || [];
let playersPerTeam = parseInt(localStorage.getItem("playersPerTeam")) || 5;

// Função para adicionar um jogador
function addPlayer() {
  const playerName = document.getElementById("playerName").value.trim();
  if (playerName) {
    if (players.some((player) => player.name === playerName)) {
      alert("Jogador já cadastrado!");
      return;
    }
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

// Função para renderizar a lista de jogadores
function renderPlayerList() {
  const playerList = document.getElementById("playerList");
  playerList.innerHTML = "";
  players.forEach((player, index) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex align-items-center justify-content-between"; // Mantém os elementos organizados na linha

    // Div para os botões de subir e descer
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "d-flex gap-1 me-3"; // Espaço entre os botões

    const moveUpButton = document.createElement("button");
    moveUpButton.textContent = "↑";
    moveUpButton.className = "btn btn-info btn-sm";
    moveUpButton.onclick = () => movePlayer(index, -1);

    const moveDownButton = document.createElement("button");
    moveDownButton.textContent = "↓";
    moveDownButton.className = "btn btn-info btn-sm";
    moveDownButton.onclick = () => movePlayer(index, 1);

    buttonDiv.appendChild(moveUpButton);
    buttonDiv.appendChild(moveDownButton);

    // Div para checkbox e nome do jogador
    const playerInfoDiv = document.createElement("div");
    playerInfoDiv.className = "d-flex align-items-center flex-grow-1"; // Nome do jogador ocupa mais espaço

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = player.checked;
    checkbox.className = "me-2"; // Espaçamento do checkbox
    checkbox.onchange = () => togglePlayerSelection(index);

    const playerName = document.createElement("span");
    playerName.textContent = player.name;
    playerName.className = "fw-bold flex-grow-1"; // Nome do jogador expande para ocupar espaço

    playerInfoDiv.appendChild(checkbox);
    playerInfoDiv.appendChild(playerName);

    // Div para os botões "Mover para Espera" e "Remover"
    const actionButtonsDiv = document.createElement("div");
    actionButtonsDiv.className = "d-flex gap-2"; // Mantém os botões alinhados à direita

    const moveButton = document.createElement("button");
    moveButton.textContent = "Final da fila";
    moveButton.className = "btn btn-secondary btn-sm";
    moveButton.onclick = () => moveToWaitingList(index);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remover";
    removeButton.className = "btn btn-danger btn-sm";
    removeButton.onclick = () => removePlayer(index);

    actionButtonsDiv.appendChild(moveButton);
    actionButtonsDiv.appendChild(removeButton);

    // Adiciona os elementos à lista
    li.appendChild(buttonDiv); // Botões de subir/descer
    li.appendChild(playerInfoDiv); // Checkbox + Nome do jogador (agora com mais espaço)
    li.appendChild(actionButtonsDiv); // Botões no final da linha

    playerList.appendChild(li);
  });
}

// Função para mover o jogador para cima ou para baixo na lista
function movePlayer(index, direction) {
  if (
    (direction === -1 && index > 0) ||
    (direction === 1 && index < players.length - 1)
  ) {
    // Troca de posição no array
    const temp = players[index];
    players[index] = players[index + direction];
    players[index + direction] = temp;

    // Atualiza no localStorage
    localStorage.setItem("players", JSON.stringify(players));
    renderLists();
  }
}

// Função para alternar a seleção do jogador
function togglePlayerSelection(index) {
  players[index].checked = !players[index].checked;
  localStorage.setItem("players", JSON.stringify(players));
  renderLists();
}

// Função para renderizar os times e a lista de espera
function renderTeams() {
  const teamA = document.getElementById("teamA");
  const teamB = document.getElementById("teamB");
  const waitingList = document.getElementById("waitingList");

  teamA.innerHTML = "";
  teamB.innerHTML = "";
  waitingList.innerHTML = "";

  // Filtra apenas os jogadores selecionados
  const selectedPlayers = players
    .filter((player) => player.checked)
    .map((player) => player.name);

  // Define os times com base no número de jogadores por time
  const teamSize = playersPerTeam;
  const teamAPlayers = selectedPlayers.slice(0, teamSize);
  const teamBPlayers = selectedPlayers.slice(teamSize, teamSize * 2);
  const waitingPlayers = selectedPlayers.slice(teamSize * 2);

  // Renderiza o Time A
  teamAPlayers.forEach((player) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = player;
    teamA.appendChild(li);
  });

  // Renderiza o Time B
  teamBPlayers.forEach((player) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = player;
    teamB.appendChild(li);
  });

  // Renderiza a lista de espera (mesmo que incompleta)
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
}

// Função para mover um jogador para a lista de espera
function moveToWaitingList(index) {
  const player = players.splice(index, 1)[0];
  players.push(player);
  localStorage.setItem("players", JSON.stringify(players));
  renderLists();
}

// Função para remover um jogador
function removePlayer(index) {
  players.splice(index, 1); // Remove o jogador do array
  localStorage.setItem("players", JSON.stringify(players)); // Atualiza o localStorage
  renderLists(); // Atualiza as listas na tela
}

// Função para indicar que um time perdeu
function teamLost(teamId) {
  const team = document.getElementById(teamId);
  const teamPlayers = Array.from(team.children).map((li) => li.textContent);
  players = players
    .filter((player) => !teamPlayers.includes(player.name))
    .concat(teamPlayers.map((name) => ({ name, checked: true })));
  localStorage.setItem("players", JSON.stringify(players));
  renderLists();
}

// Função para mesclar os times (apenas entre Time A e Time B)
function mergeTeams() {
  const teamAPlayers = Array.from(
    document.getElementById("teamA").children
  ).map((li) => li.textContent);
  const teamBPlayers = Array.from(
    document.getElementById("teamB").children
  ).map((li) => li.textContent);
  const allPlayers = teamAPlayers
    .concat(teamBPlayers)
    .sort(() => Math.random() - 0.5);

  // Redistribui os jogadores entre Time A e Time B
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
    playersPerTeam = newPlayersPerTeam;
    localStorage.setItem("playersPerTeam", playersPerTeam);
    renderLists();
  } else {
    alert("Por favor, insira um número válido de jogadores por time.");
  }
}

// Função para remover todos os jogadores
function clearAllPlayers() {
  players = [];
  localStorage.removeItem("players");
  renderLists();
}

// Recupera o valor salvo ou define 5 como padrão
document.getElementById("playersPerTeam").value =
  localStorage.getItem("playersPerTeam") || 5;

// Renderiza as listas ao carregar a página
renderLists();
