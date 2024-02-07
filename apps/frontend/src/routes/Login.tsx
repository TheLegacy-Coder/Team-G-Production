import React, { useEffect } from "react";
import { lock } from "../stores/LoginStore.ts";
import "./styles/Login.css";

export const Login = () => {
  useEffect(() => {
    lock.show();
  });

  return (
    <div className="login-container">
      <div className={"lock-container"} id="lock-container"></div>
    </div>
  );
};
