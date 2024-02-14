import React, { useEffect } from "react";
import { lock } from "../stores/LoginStore.ts";
import "./styles/Login.css";
import { contextMenuState } from "../stores/ContextMenuState.ts";
import { Profile } from "../components/Profile.tsx";

export const Login = () => {
  useEffect(() => {
    lock.hide();
    lock.show();
    if (contextMenuState.intendedPage === undefined) {
      contextMenuState.intendedPage = <Profile />;
      contextMenuState.intendedPageTitle = "Profile";
    }
  });

  return (
    <div className="login-container">
      <div className={"lock-container"} id="lock-container"></div>
    </div>
  );
};
