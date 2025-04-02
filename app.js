// Registrar Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );

        // Verifica se há atualizações
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          console.log("New Service Worker found:", newWorker);

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                console.log("New content available - please refresh!");
                // Aqui você pode mostrar um botão para o usuário atualizar
                showUpdateUI();
              } else {
                console.log("Content is cached for offline use.");
              }
            }
          });
        });
      })
      .catch(function (err) {
        console.log("ServiceWorker registration failed: ", err);
      });

    // Forçar atualização periódica
    setInterval(() => {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });
    }, 60 * 60 * 1000); // Verifica atualizações a cada hora
  });
}

function showUpdateUI() {
  // Implemente sua lógica de UI para notificar o usuário
  const updateDiv = document.createElement("div");
  updateDiv.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: #fff; padding: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.3); z-index: 1000;">
      Nova versão disponível! <button id="refreshButton">Atualizar</button>
    </div>
  `;
  document.body.appendChild(updateDiv);

  document.getElementById("refreshButton").addEventListener("click", () => {
    window.location.reload(true);
  });
}
