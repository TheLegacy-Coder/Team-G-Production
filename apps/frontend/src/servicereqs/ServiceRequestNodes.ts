import axios, { AxiosResponse } from "axios";

interface ServiceRequest {
  requestID: string;
  requestType: string;
  location: string;
  handled: boolean;
  requester: string;
  helpingEmployee: string | null;
  desc: string;
  time: string; // Assuming a string formatted timestamp is received from the server
}

export const serviceRequests: Map<string, ServiceRequest> = new Map([]);

export function getServiceRequests(): ServiceRequest | undefined {
  axios
    .get("http://localhost:3000/api/services/requests") // REPLACE WITH ACTUAL URL
    .then((response: AxiosResponse<ServiceRequest[]>) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching service requests:", error);
      return undefined;
    });
  return undefined;
}

// other code remains unchanged.
