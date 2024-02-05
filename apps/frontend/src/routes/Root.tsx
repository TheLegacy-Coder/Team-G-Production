import React from "react";
import { Outlet } from "react-router-dom";
import { TopNavbar } from "../components/TopNavbar.tsx";

export const Root = () => {
  return (
    <div id="root">
      <TopNavbar />

      <Outlet />
    </div>
  );
};
