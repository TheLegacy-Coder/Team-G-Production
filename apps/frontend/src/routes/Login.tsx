import React, { useReducer, useState } from "react";
import { loginStore } from "../stores/LoginStore.ts";
import { Navigate } from "react-router-dom";
import { contextMenuState } from "../stores/ContextMenuState.ts";

export const Login = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState(""); // Add state for login type
  const handleLogin = () => {
    // Implement your login logic here
    // Implementation of displaying either administrator or user login goes here (buttons)
    if (
      loginType === "admin" &&
      (username !== "admin" || password !== "admin")
    ) {
      return;
    } else {
      loginStore.login(loginType);
      contextMenuState.loadIntendedPage();
      console.log("Logging in with:", loginType, username, password);
      forceUpdate();
    }
  };
  return (
    <div className="login-container">
      <div>
        <br />
        Welcome to the Login Page
        <br />
        <br />
        Please select a login type below:
      </div>

      {loginStore.loggedIn ? (
        <Navigate to={loginStore.from} replace />
      ) : (
        <div />
      )}
      <div>
        <button
          style={{ margin: "16px" }}
          onClick={() => setLoginType("admin")}
        >
          Administrator Login
        </button>
        <button
          style={{ margin: "16px" }}
          onClick={() => setLoginType("employee")}
        >
          Employee Login
        </button>
        <button style={{ margin: "16px" }} onClick={() => setLoginType("user")}>
          User Login
        </button>
      </div>

      {/* Conditional rendering based on login type */}
      {loginType === "admin" && (
        <>
          <input
            style={{ background: "lightblue", margin: "16px" }}
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={{ background: "lightblue", margin: "16px" }}
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </>
      )}

      {loginType === "user" && (
        <>
          <input
            style={{ background: "lightblue", margin: "16px" }}
            type="text"
            placeholder="User Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={{ background: "lightblue", margin: "16px" }}
            type="password"
            placeholder="User Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </>
      )}

      {loginType === "employee" && (
        <>
          <input
            style={{ background: "lightblue", margin: "16px" }}
            type="text"
            placeholder="Employee Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={{ background: "lightblue", margin: "16px" }}
            type="password"
            placeholder="Employee Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </>
      )}

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
