import React from "react";

import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  // TODO: Use authentication token
  const auth = false; //TODO: add auth check

  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};