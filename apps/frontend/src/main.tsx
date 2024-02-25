import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { speechEngineBackend } from "./stores/SpeechEngineBackend.ts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Auth0Provider
    clientId={"6pLipx9nvYgidSSoiuodUl23OMScUmgU"}
    domain={"dev-1uv1d12i66i3umpd.us.auth0.com"}
    authorizationParams={{
      redirectUri: window.location.origin,
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>,
);
