import React from "react";
import { TopNavbar } from "./TopNavbar.tsx";

export const PageNotFound = () => {
  return (
    <div className={"page-frame"}>
      <TopNavbar />
      <div>Error 404: Page Not Found</div>
    </div>
  );
};
