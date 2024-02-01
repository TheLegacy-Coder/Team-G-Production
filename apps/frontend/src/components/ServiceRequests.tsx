import React from "react";
import "./styles/ServiceRequest.css";
import { Flowers } from "./Flowers.tsx";

// ServiceRequests component responsible for handling service requests
export const ServiceRequests = () => {
  // Like before, ServiceRequests handling logic
  return (
    <div>
      <div className={"service-request-container"}>
        <br />
        <br />
        <button
          className={"request-buttons"} /* onClick={handleServiceRequest} */
        >
          <Flowers />
        </button>
        <br />
        <br />
      </div>
    </div>
  );
};
