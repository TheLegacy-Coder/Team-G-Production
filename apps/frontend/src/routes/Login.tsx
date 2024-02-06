import React, { useReducer, useState } from "react";
import { loginStore } from "../stores/LoginStore.ts";
import { Navigate } from "react-router-dom";
import { contextMenuState } from "../stores/ContextMenuState.ts";
import { useAuth0 } from "@auth0/auth0-react";

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

  const AuthLoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    //sends user to login page
    return <button onClick={() => loginWithRedirect()}>AuthLogin</button>;
  };

  const LogOutButton = () => {
    const { logout } = useAuth0();
    //returns to the home page
    return (
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log Out
      </button>
    );
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
      {loginStore.loggedIn && window.location.pathname !== "/" ? (
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
        <AuthLoginButton />
        <LogOutButton />
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
