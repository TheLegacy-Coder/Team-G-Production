import React from "react";
import "./styles/ServiceRequest.css";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { ServiceRequestForm } from "./ServiceRequestForm.tsx";
import { RequestType } from "common/src/ServiceRequests.ts";

// ServiceRequests component responsible for handling service requests
export const ServiceRequests = () => {
  // Like before, ServiceRequests handling logic
  return (
    <div>
      <div className={"service-request-container"}>
        <br />
        <br />
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
        <br />
        <br />
      </div>
    </div>
  );
};
