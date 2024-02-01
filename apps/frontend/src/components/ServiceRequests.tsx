import React from "react";
import "./styles/ServiceRequest.css";
import { Flowers } from "./Flowers.tsx";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";

// ServiceRequests component responsible for handling service requests
export const ServiceRequests = () => {
  // Like before, ServiceRequests handling logic
  return (
    <div>
      <div className={"service-request-container"}>
        <br />
        <br />
        <ContextMenuRouterButton
          content={<Flowers />}
          lable={"Flowers"} // Fixed typo in the label attribute
          style={"request-nav-style"}
        />
        <br />
        <br />
      </div>
    </div>
  );
};
