import React, { useReducer, useState } from "react";
import { loginStore } from "../stores/LoginStore.ts";
import { Navigate } from "react-router-dom";
import { contextMenuState } from "../stores/ContextMenuState.ts";

interface LoginTypeButtonProps {
  name: string;
  loginType: string;
  selected: boolean;
}

export const Login = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("user"); // Add state for login type

  const handleLogin = () => {
    // Implement your login logic here
    // Implementation of displaying either administrator or user login goes here (buttons)
    loginStore.loggedIn = true;
    contextMenuState.loadIntendedPage();
    console.log("Logging in with:", loginType, username, password);
    forceUpdate();
  };

  const LoginTypeButton = ({
    name,
    loginType,
    selected,
  }: LoginTypeButtonProps) => {
    return (
      <button
        style={{ backgroundColor: selected ? "grey" : "white" }}
        onClick={() => setLoginType(loginType)}
      >
        {name}
      </button>
    );
  };

  let usernamePlaceholder, passwordPlaceholder;
  switch (loginType) {
    case "admin":
      usernamePlaceholder = "Admin Username";
      passwordPlaceholder = "Admin Password";
      break;
    case "employee":
      usernamePlaceholder = "Employee Username";
      passwordPlaceholder = "Employee Password";
      break;
    case "user":
      usernamePlaceholder = "User Username";
      passwordPlaceholder = "User Password";
      break;
    default:
      usernamePlaceholder = "Username";
      passwordPlaceholder = "Password";
  }

  return (
    <div className="login-container">
      {loginStore.loggedIn ? (
        <Navigate to={loginStore.from} replace />
      ) : (
        <div />
      )}

      <div style={{ margin: "16px" }}>
        <LoginTypeButton
          name="Administrator Login"
          loginType="admin"
          selected={loginType === "admin"}
        />
        <LoginTypeButton
          name="Employee Login"
          loginType="employee"
          selected={loginType === "employee"}
        />
        <LoginTypeButton
          name="User Login"
          loginType="user"
          selected={loginType === "user"}
        />
      </div>

      <>
        <input
          style={{ background: "lightblue", margin: "16px" }}
          type="text"
          placeholder={usernamePlaceholder}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={{ background: "lightblue", margin: "16px" }}
          type="password"
          placeholder={passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
