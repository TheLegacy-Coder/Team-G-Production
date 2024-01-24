import React from "react";
import { TopNavbar } from "./TopNavbar.tsx";

type PageFrameProps = {
  children: JSX.Element;
};
export const PageFrame = ({ children }: PageFrameProps) => {
  return (
    <div className={"page-frame"}>
      <TopNavbar />
      {children}
    </div>
  );
};
