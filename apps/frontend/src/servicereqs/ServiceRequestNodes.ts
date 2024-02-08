import axios from "axios";
import { loginStore } from "../stores/LoginStore.ts";
import { Prisma } from "database";

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

export type ServiceRequestsWrapper = {
  data: ServiceRequest[];
};

export const serviceRequests: Map<string, ServiceRequest> = new Map([]);

export async function getServiceRequests(): Promise<ServiceRequestsWrapper> {
  if (loginStore.loginType === "admin" && loginStore.loggedIn) {
    return axios.get("http://localhost:3000/api/services/requests", {
      params: { getAll: true },
    }); // REPLACE WITH ACTUAL URL
  } else {
    return axios.get("http://localhost:3000/api/services/requests", {
      params: { employeeID: "a" },
    }); // REPLACE WITH ACTUAL URL
  }
}

export function postServiceRequest(
  request: Prisma.ServiceRequestUncheckedCreateInput,
) {
  axios
    .post("http://localhost:3000/api/services/requests", request) // REPLACE WITH ACTUAL URL
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching service requests:", error);
      return undefined;
    });
  return undefined;
}

// other code remains unchanged.
