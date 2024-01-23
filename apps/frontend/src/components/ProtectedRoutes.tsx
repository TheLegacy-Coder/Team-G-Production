import React from "react";

import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoutes = () => {
  // TODO: Use authentication token
  const auth = false;

  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};
