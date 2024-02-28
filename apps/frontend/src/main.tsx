import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { speechEngineBackend } from "./stores/SpeechEngineBackend.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
