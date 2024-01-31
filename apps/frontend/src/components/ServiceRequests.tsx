import React from "react";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import "./styles/ServiceRequest.css";

export const ServiceRequests = () => {
  return (
    <div>
      <div className={"service-request-container"}>
        <br />
        <br />
        <button className={"request-buttons"}>
          <ContextMenuRouterButton
            content={
              <p className={"service-button-text"}>
                Flowers are being delivered
              </p>
            }
            lable={"Flowers"}
            style={"request-nav-style"}
          />
        </button>
        <br />
        <br />
        <button className={"request-buttons"}>
          <ContextMenuRouterButton
            content={<div>Chocolates are being delivered</div>}
            lable={"Chocolate"}
            style={"request-nav-style"}
          />
        </button>
        <br />
        <br />
        <button className={"request-buttons"}>
          <ContextMenuRouterButton
            content={<div>Stuff animals are being delivered</div>}
            lable={"Stuffed Animal"}
            style={"request-nav-style"}
          />
        </button>
      </div>
    </div>
  );
};
