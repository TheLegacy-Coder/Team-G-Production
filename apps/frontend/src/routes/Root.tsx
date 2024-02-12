import React from "react";
import { Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <div id="root">
      <Outlet />
    </div>
  );
};
