import React, { useState } from "react";
//import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState(""); // Add state for login type

  const handleLogin = () => {
    // Implement your login logic here
    // Implementation of displaying either administrator or user login goes here (buttons)
    console.log("Logging in with:", loginType, username, password);
  };

  return (
    <div className="login-container">
      <div>
        <button onClick={() => setLoginType("admin")}>
          Administrator Login
        </button>
        <button onClick={() => setLoginType("employee")}>Employee Login</button>
        <button onClick={() => setLoginType("user")}>User Login</button>
      </div>

      {/* Conditional rendering based on login type */}
      {loginType === "admin" && (
        <>
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
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
            type="text"
            placeholder="User Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
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
            type="text"
            placeholder="Employee Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
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
        const data =  JSON.stringify( {
            time:new Date(),
            score:count
        });
        console.log(data);
        //sends a post request the /api/high-score
        const res = await axios.post("/api/high-score",data, {
            headers: {
                "Content-Type":"application/json"
            }
        });
        if(res.status == 200) {
            console.log("added highscore");
        }
    }
    //the html returned from the component
    return(
        <div className={"example-component"}>
            <div>
                current count {count}
            </div>
            <button onClick={()=> {setCount(count+1);}}>
                increment count
            </button>
            <button onClick={() => {submitHighscore().then();}}>
                Submit
            </button>
        </div>
    );
}

 */
