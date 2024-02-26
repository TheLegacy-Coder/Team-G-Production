import React from "react";
import "./styles/ServiceRequest.css";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { ServiceRequestForm } from "./ServiceRequestForm.tsx";
import { RequestType } from "common/src/ServiceRequests.ts";
import {
  Flower1,
  Translate,
  YinYang,
  Truck,
  Recycle,
} from "react-bootstrap-icons";

// ServiceRequests component responsible for handling service requests
export const ServiceRequests = () => {
  const ICON_SIZE = 57;
  // Like before, ServiceRequests handling logic
  return (
    <div className={"asdf-service-request-container"}>
      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Flowers} />}
        icon={<Flower1 color="white" size={ICON_SIZE} />}
        lable={"Flowers"} // Fixed typo in the label attribute
        style={"request-nav-style flower-button"}
      />

      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Interpreter} />}
        icon={<Translate color="white" size={ICON_SIZE} />}
        lable={"Interpreter"} // Fixed typo in the label attribute
        style={"request-nav-style interpreter-button"}
      />

      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Religious} />}
        icon={<YinYang color="white" size={ICON_SIZE} />}
        lable={"Religious"} // Fixed typo in the label attribute
        style={"request-nav-style religious-button"}
      />

      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Transport} />}
        icon={<Truck color="white" size={ICON_SIZE} />}
        lable={"Transport"} // Fixed typo in the label attribute
        style={"request-nav-style transport-button"}
      />

      <ContextMenuRouterButton
        content={<ServiceRequestForm requestType={RequestType.Sanitation} />}
        icon={<Recycle color="white" size={ICON_SIZE} />}
        lable={"Sanitation"} // Fixed typo in the label attribute
        style={"request-nav-style sanitation-button"}
      />
    </div>
  );
};
