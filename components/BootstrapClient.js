// components/BootstrapClient.js
"use client";

import { useEffect } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function BootstrapClient() {
  useEffect(() => {
    // Inicializa os componentes do Bootstrap que usam JS
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
