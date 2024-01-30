import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import { loginStore } from "../stores/LoginStore.ts";

export const ProtectedRoutes = () => {
  // TODO: Use authentication token
  const auth = loginStore.loggedIn;

  loginStore.from = location.pathname;
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};
