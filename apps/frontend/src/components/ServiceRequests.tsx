import React from "react";
import "./styles/ServiceRequest.css";
import { Flowers } from "./Flowers.tsx";

// ServiceRequests component responsible for handling service requests
export const ServiceRequests = () => {
  // Function to handle the service request when the button is clicked
  const handleServiceRequest = async () => {
    // Define the request body with serviceType and roomNumber
    const requestBody = {
      requestType: "Flower Delivery", // You can customize this based on your needs
      location: "Service C001L2", // Example room number; replace with actual data
    };

    try {
      // Send a POST request to the serve with the service request data
      const response = await fetch("http://exampleurlfor.servicerequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Check if the response is successful
      if (response.ok) {
        // Service request submitted successfully
        console.log("Service request submitted successfully");
      } else {
        // Handle error cases
        console.error("Failed to submit service request");
      }
    } catch (error) {
      console.error("Error submitting service request:", error);
    }
  };

  // Like before, ServiceRequests handling logic
  return (
    <div>
      <div className={"service-request-container"}>
        <br />
        <br />
        <button className={"request-buttons"} onClick={handleServiceRequest}>
          <Flowers />
        </button>
        <br />
        <br />
      </div>
    </div>
  );
};
