import React, { useReducer, useState } from "react";
import { loginStore } from "../stores/LoginStore.ts";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState(""); // Add state for login type
  const handleLogin = () => {
    // Implement your login logic here
    // Implementation of displaying either administrator or user login goes here (buttons)
    loginStore.loggedIn = true;
    console.log("Logging in with:", loginType, username, password);
    forceUpdate();
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

export default Login;

/*
//this is a basic counter component to show where components should be placed
export function ExampleComponent() {
  //saves the count
  const [count, setCount] = useState(0);

  //submits the count as a high score
  async function submitHighscore() {
    const data = JSON.stringify({
      time: new Date(),
      score: count,
    });
    console.log(data);
    //sends a post request the /api/high-score
    const res = await axios.post("/api/high-score", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      console.log("added highscore");
    }
  }
  //the html returned from the component
  return (
    <div className={"example-component"}>
      <div>current count {count}</div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        increment count
      </button>
      <button
        onClick={() => {
          submitHighscore().then();
        }}
      >
        Submit
      </button>
    </div>
  );
}

 */
