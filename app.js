// app.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    const SW_TIMEOUT = 5000;
    const registrationPromise =
      navigator.serviceWorker.register("service-worker.js");

    Promise.race([
      registrationPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject("SW timeout"), SW_TIMEOUT)
      )
    ])
      .then((registration) => {
        console.log("SW registrado:", registration.scope);

        // Verificação imediata + periódica
        registration.update();
        setInterval(() => registration.update(), 60 * 60 * 1000);

        // Monitorar atualizações
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showUpdateUI();
            }
          });
        });
      })
      .catch((err) => console.error("Erro no SW:", err));
  });
}

function showUpdateUI() {
  if (
    document.getElementById("sw-update") ||
    localStorage.getItem("sw-update-ignored")
  )
    return;

  const updateDiv = document.createElement("div");
  updateDiv.id = "sw-update";
  updateDiv.innerHTML = `
    <div style="/* estilos */">
      <p>Nova versão disponível!</p>
      <button id="sw-update-reload">Atualizar</button>
      <button id="sw-update-dismiss">Ignorar</button>
    </div>
  `;

  document.body.appendChild(updateDiv);

  document.getElementById("sw-update-reload").addEventListener("click", () => {
    window.location.reload();
  });

  document.getElementById("sw-update-dismiss").addEventListener("click", () => {
    localStorage.setItem("sw-update-ignored", "true");
    updateDiv.remove();
  });
}
