import React from "react";
import "./styles/ServiceRequest.css";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { ServiceRequestForm } from "./ServiceRequestForm.tsx";
import { RequestType } from "common/src/ServiceRequests.ts";
import { mouse } from "../map/Mouse";

// ServiceRequests component responsible for handling service requests
export const ServiceRequests = () => {
  mouse.clickDown(0, 0);
  mouse.clickUp(0, 0);
  // Like before, ServiceRequests handling logic
  return (
    <div className={"asdf-service-request-container"}>
      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Flowers} />}
        lable={"Flowers"} // Fixed typo in the label attribute
        style={"request-nav-style"}
      />

      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Interpreter} />}
        lable={"Interpreter"} // Fixed typo in the label attribute
        style={"request-nav-style"}
      />

      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Religious} />}
        lable={"Religious"} // Fixed typo in the label attribute
        style={"request-nav-style"}
      />

      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Transport} />}
        lable={"Transport"} // Fixed typo in the label attribute
        style={"request-nav-style"}
      />

      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Sanitation} />}
        lable={"Sanitation"} // Fixed typo in the label attribute
        style={"request-nav-style"}
      />
    </div>
  );
};
