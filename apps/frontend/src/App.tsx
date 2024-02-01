import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Routes
import { Root } from "./routes/Root.tsx";
import { PageNotFound } from "./routes/PageNotFound.tsx";
import { Index } from "./routes/Index.tsx";
import { InteractableMap } from "./routes/InteractableMap.tsx";
import { Login } from "./routes/Login.tsx";
import { Csvs } from "./routes/Csvs.tsx";

// Protected Routes
import { ProtectedRoutes } from "./routes/ProtectedRoutes.tsx";
import { ViewRequests } from "./routes/ViewRequests.tsx";

const handleSearch = () => {
  // Implement your login logic here
  // Implementation of displaying either administrator or user login goes here (buttons)
  console.log("Logging in with:");
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <PageNotFound />,
      children: [
        {
          children: [
            { index: true, element: <Index /> },
            {
              path: "/map",
              element: <InteractableMap />,
            },
            {
              path: "/login",
              element: <Login />,
            },
            {
              element: <ProtectedRoutes />,
              children: [
                {
                  path: "/profile",
                  element: <div>secret profile</div>,
                },
                {
                  path: "/",
                  element: (
                    <div className="topnav">
                      <input type="text" placeholder="Search.." />
                      <button onClick={handleSearch}>Enter</button>
                    </div>
                  ),
                },
                {
                  path: "/csvs",
                  element: <Csvs />,
                },
                {
                  path: "/requests",
                  element: <ViewRequests />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
