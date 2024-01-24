import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ExampleRoute from "./routes/ExampleRoute.tsx";
import { BreadthFirstSearch, mapNodes } from "./map/MapNode.ts";
import { InteractableMap } from "./components/InteractableMap.tsx";

import { ProtectedRoutes } from "./components/ProtectedRoutes.tsx";
import { PageFrame } from "./components/PageFrame.tsx";
import Login from "./components/ExampleComponent.tsx";

const handleSearch = () => {
  // Implement your login logic here
  // Implementation of displaying either administrator or user login goes here (buttons)
  console.log("Logging in with:");
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <div />,
      element: <Root />,
      children: [
        {
          path: "",
          element: (
            <PageFrame>
              <ExampleRoute />
            </PageFrame>
          ),
        },
      ],
    },
    {
      path: "/map",
      element: (
        <PageFrame>
          <InteractableMap />
        </PageFrame>
      ),
    },
    {
      path: "/login",
      element: (
        <PageFrame>
          <div>
            <Login /> {/* Add the login component */}
          </div>
        </PageFrame>
      ),
    },
    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/profile",
          element: (
            <PageFrame>
              <div>secret profile</div>
            </PageFrame>
          ),
        },
        {
          path: "/search",
          element: (
            <PageFrame>
              <div className="topnav">
                <input type="text" placeholder="Search.." />
                <button onClick={handleSearch}>Enter</button>
              </div>
            </PageFrame>
          ),
        },
      ],
    },
  ]);
  console.log(mapNodes);
  console.log(
    BreadthFirstSearch(mapNodes.get("CCONF001L1"), mapNodes.get("CHALL009L1")),
  );
  return <RouterProvider router={router} />;

  function Root() {
    return (
      <div className="w-100 h-100 d-flex flex-column overflow-auto">
        <Outlet />
      </div>
    );
  }
}

export default App;
