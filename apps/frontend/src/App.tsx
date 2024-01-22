import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import ExampleRoute from "./routes/ExampleRoute.tsx";
import { ProtectedRoutes } from "./components/ProtectedRoutes.tsx";
import { PageFrame } from "./components/PageFrame.tsx";
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
          <div>public map</div>
        </PageFrame>
      ),
    },
    {
      path: "/login",
      element: (
        <PageFrame>
          <div>public login</div>
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
              <div>secret search</div>
            </PageFrame>
          ),
        },
      ],
    },
  ]);

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
