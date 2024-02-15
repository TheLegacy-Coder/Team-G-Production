import axios from "axios";
import { Prisma } from "database";
import {
  ServiceRequestExternalTransport,
  ServiceRequestFlowers,
  ServiceRequestInterpreter,
  ServiceRequestReligious,
  ServiceRequestSanitation,
} from "common/src/ServiceRequests.ts";

export type ServiceRequest = {
  requestID: string;
  requestType: string;
  location: string;
  status: string;
  requester: string;
  helpingEmployee?: string | null;
  desc: string;
  time?: string;
};

export type ServiceRequestList = {
  Flowers: ServiceRequestFlowers[];
  Religious: ServiceRequestReligious[];
  Sanitation: ServiceRequestSanitation[];
  Interpreter: ServiceRequestInterpreter[];
  Transport: ServiceRequestExternalTransport[];
};

export type ServiceRequestsWrapper = {
  data: ServiceRequestList;
};

export const serviceRequests: Map<string, ServiceRequest> = new Map([]);

export function postServiceRequest(
  request: Prisma.ServiceRequestUncheckedCreateInput,
) {
  axios
    .post("http://localhost:3000/api/services/requests", request) // REPLACE WITH ACTUAL URL
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching service requests:", error);
      return undefined;
    });
  return undefined;
}

// other code remains unchanged.
