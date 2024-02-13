import axios from "axios";
import { currentEmployee, loginStore } from "../stores/LoginStore.ts";
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

export async function getServiceRequests(): Promise<ServiceRequestsWrapper> {
  if (loginStore.loginType === "admin" && loginStore.loggedIn) {
    return {
      data: {
        Flowers: [
          {
            requestID: "1",
            requestType: "Flowers",
            location: "Hospital",
            status: "Assigned",
            priority: "Low",
            requester: "John Doe",
            helpingEmployee: "Jane Doe",
            desc: "Need flowers for patient",
            flowerType: "Roses",
            amount: 12,
          },
          {
            requestID: "2",
            requestType: "Flowers",
            location: "Hospital",
            status: "In Progress",
            priority: "Medium",
            requester: "Jane Doe",
            helpingEmployee: null,
            desc: "Need flowers for patient",
            flowerType: "Daisies",
            amount: 24,
          },
          {
            requestID: "3",
            requestType: "Flowers",
            location: "Hospital",
            status: "Completed",
            priority: "High",
            requester: "John Doe",
            helpingEmployee: "Jane Doe",
            desc: "Need flowers for patient",
            flowerType: "Orchids",
            amount: 6,
          },
        ],
        Religious: [
          {
            requestID: "2",
            requestType: "Religious",
            location: "Hospital",
            status: "In Progress",
            priority: "Medium",
            requester: "Jane Doe",
            helpingEmployee: null,
            desc: "Need a Rabbi",
            faith: "Judaism",
          },
        ],
        Sanitation: [
          {
            requestID: "3",
            requestType: "Sanitation",
            location: "Hospital",
            status: "Completed",
            priority: "High",
            requester: "John Doe",
            helpingEmployee: "Jane Doe",
            desc: "Need to clean up vomit",
            hazardous: true,
            messType: "Vomit",
          },
        ],
        Interpreter: [
          {
            requestID: "4",
            requestType: "Interpreter",
            location: "Hospital",
            status: "Assigned",
            priority: "Emergency",
            requester: "Jane Doe",
            helpingEmployee: null,
            desc: "Need a Spanish interpreter",
            language: "Spanish",
          },
        ],
        Transport: [
          {
            requestID: "5",
            requestType: "Transport",
            location: "Hospital",
            status: "In Progress",
            priority: "High",
            requester: "John Doe",
            helpingEmployee: "Jane Doe",
            desc: "Need an ambulance",
            vehicle: "Ambulance",
            destination: "Hospital",
          },
        ],
      },
    };

    return axios.get("http://localhost:3000/api/services/requests", {
      params: { getAll: true },
    }); // REPLACE WITH ACTUAL URL
  } else {
    return axios.get("http://localhost:3000/api/services/requests", {
      params: { employeeID: currentEmployee?.employeeID },
    }); // REPLACE WITH ACTUAL URL
  }
}

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
