import axios, { AxiosResponse } from "axios";
import {
  RequestType,
  ServiceRequest,
  ServiceRequestEndpoints,
} from "common/src/ServiceRequests.ts";
import { Employee } from "common/src/Employee.ts";
import { currentToken } from "../stores/LoginStore.ts";

// Used to change the status of a Service Request
export function changeStatusAxios(requestID: string, newStatus: string) {
  return new Promise((resolve, reject) => {
    axios
      .patch(
        "http://localhost:3000/api/services/requests",
        {
          requestID: requestID,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        },
      )
      .then((response) => {
        // Update the requests in state
        resolve(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching service requests:", error);
        reject("Status Change Failed");
        return undefined;
      });
  });
}

export function getAllAxios() {
  return axios.get("http://localhost:3000/api/services/requests", {
    params: { getAll: true },
    headers: { Authorization: `Bearer ${currentToken}` },
  });
}

export function getFromEmployeeAxios(employeeID: string) {
  return axios.get("http://localhost:3000/api/services/requests", {
    params: { employeeID: employeeID, getAll: false },
    headers: { Authorization: `Bearer ${currentToken}` },
  });
}

export function serviceRequestPostAxios(
  requestType: RequestType,
  req: ServiceRequest,
) {
  try {
    axios
      .post(
        "http://localhost:3000/api/" + ServiceRequestEndpoints.get(requestType),
        req,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        },
      )
      .then((response: AxiosResponse<Employee[]>) => {
        console.log(response);
      });

    // Replace with the actual property holding employee names in the API response
  } catch (error) {
    console.error("Error fetching employee names:", error);
  }
}
