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
import { ViewEmployees } from "./routes/ViewEmployees.tsx";
import { MobileDirections } from "./routes/MobileDirections.tsx";

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
              path: "/mobiledirections",
              element: <MobileDirections />,
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
                  path: "/csvs",
                  element: <Csvs />,
                },
                {
                  path: "/requests",
                  element: <ViewRequests />,
                },
                {
                  path: "/employees",
                  element: <ViewEmployees />,
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
