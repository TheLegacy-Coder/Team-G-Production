import React, { useEffect, useState } from "react";
import "./styles/ViewRequests.css";
import axios, { AxiosResponse } from "axios";
import { TabSwitcher } from "../components/TabSwitcher.tsx";
import {
  AllServiceRequests,
  ServiceRequestExternalTransport,
  ServiceRequestFlowers,
  ServiceRequestInterpreter,
  ServiceRequestReligious,
  ServiceRequestSanitation,
  ServiceRequest,
} from "common/src/ServiceRequests.ts";
import { currentEmployee } from "../stores/LoginStore.ts";
import { EmployeeWrapper } from "./ViewEmployees.tsx";
import { Employee } from "common/src/Employee.ts";
//import {number} from "prop-types";

async function getEmployees(): Promise<EmployeeWrapper> {
  return axios.get("http://localhost:3000/api/employees", {
    params: { getAll: true },
  });
}

interface RequestsTableProps {
  updateRequests: () => void;
  requests: ServiceRequest[] | undefined;
  type?: string;
}

export const RequestsTable = ({
  updateRequests,
  requests,
  type,
}: RequestsTableProps) => {
  const [stati] = useState(new Map<string, string>());
  const [filter, setFilter] = useState<string>("All");
  const [employeeFilter, setEmployeeFilter] = useState<string>("All");
  const [employees, setEmployees] = useState<Employee[]>([]);
  // Get employees from DB and store them in state
  const getAndSetEmployees = () => {
    getEmployees().then((list) => {
      if (list !== undefined) {
        setEmployees(list.data);
      }
    });
  };
  // Fetch the employees from the server on load
  useEffect(getAndSetEmployees, []);
  // Change status of a request, PATCH to backend
  const handleStatusChange = (requestID: string, newStatus: string) => {
    axios
      .patch("http://localhost:3000/api/services/requests", {
        requestID: requestID,
        status: newStatus,
      })
      .then((response) => {
        // Update the requests in state
        updateRequests();
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching service requests:", error);
        return undefined;
      });
  };

  // Render a select element for the status cell of a request
  const renderStatus = (request: ServiceRequest) => {
    stati.set(request.requestID, request.status);
    return (
      <>
        <select
          name="status"
          id={request.requestID}
          className={"status"}
          value={stati.get(request.requestID)}
          onChange={(e) => {
            stati.set(e.target.id, e.target.value);
            handleStatusChange(e.target.id, e.target.value);
          }}
        >
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </>
    );
  };

  // Render rows for requests based on the selected filter
  const rows: React.ReactElement[] = [];
  requests?.forEach((request) => {
    if (
      employeeFilter !== request.helpingEmployee &&
      employeeFilter !== "All"
    ) {
      return;
    }
    if (
      filter === "All" ||
      (filter === "Assigned" && request.status === "Assigned") ||
      (filter === "In Progress" && request.status === "In Progress") ||
      (filter === "Completed" && request.status === "Completed")
    ) {
      rows.push(
        <tr key={request.requestID}>
          <td>{request.requestID}</td>
          <td>{request.requestType}</td>
          <td>{request.location}</td>
          <td>{renderStatus(request)}</td>
          <td>{request.requester}</td>
          <td>{request.helpingEmployee}</td>
          <td>{request.desc}</td>
          <td>{request.time}</td>
          {type === "Flowers" && (
            <>
              <td>{(request as ServiceRequestFlowers).flowerType}</td>
              <td>{(request as ServiceRequestFlowers).amount}</td>
            </>
          )}
          {type === "Religious" && (
            <td>{(request as ServiceRequestReligious).faith}</td>
          )}
          {type === "Sanitation" && (
            <>
              <td>
                {(request as ServiceRequestSanitation).hazardous.toString()}
              </td>
              <td>{(request as ServiceRequestSanitation).messType}</td>
            </>
          )}
          {type === "Interpreter" && (
            <td>{(request as ServiceRequestInterpreter).language}</td>
          )}
          {type === "Transport" && (
            <>
              <td>{(request as ServiceRequestExternalTransport).vehicle}</td>
              <td>
                {(request as ServiceRequestExternalTransport).destination}
              </td>
            </>
          )}
        </tr>,
      );
    }
  });

  return (
    <>
      <div className="filter">
        <label htmlFor="statusFilter" className="filterTextStatus">
          Filter by Status:
        </label>
        <select
          name="statusFilter"
          className="statusFilter"
          id="statusFilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <br />
        <label className={"filterTextEmployees"}>Filter by Employee:</label>
        <select
          name="employeeFilter"
          className="statusFilter"
          id="employeeFilter"
          value={employeeFilter}
          onChange={(e) => {
            setEmployeeFilter(e.target.value);
          }}
        >
          <option value={"All"}>All</option>
          {employees.map((emp) => (
            <option id={emp.employeeID} value={emp.employeeID}>
              {emp.firstName + " " + emp.lastName}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Request Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Requester</th>
            <th>Employee</th>
            <th>Description</th>
            <th>Time</th>
            {type === "Flowers" && (
              <>
                <th>Flower Type</th>
                <th>Amount</th>
              </>
            )}
            {type === "Religious" && <th>Faith</th>}
            {type === "Sanitation" && (
              <>
                <th>Hazardous</th>
                <th>Mess Type</th>
              </>
            )}
            {type === "Interpreter" && <th>Language</th>}
            {type === "Transport" && (
              <>
                <th>Vehicle</th>
                <th>Destination</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

export const ViewRequests = () => {
  const [requests, setRequests] = useState<AllServiceRequests>();

  // Get requests from DB and store them in state
  const updateRequests = () => {
    if (currentEmployee?.accessLevel === "admin") {
      axios
        .get("http://localhost:3000/api/services/requests", {
          params: { getAll: true },
        })
        .then((res: AxiosResponse<AllServiceRequests>) => {
          setRequests(res.data);
        });
    } else {
      axios
        .get("http://localhost:3000/api/services/requests", {
          params: { employeeID: currentEmployee?.employeeID },
        })
        .then((res: AxiosResponse<AllServiceRequests>) => {
          setRequests(res.data);
        });
    }
  };

  // Fetch the requests from the server on load
  useEffect(updateRequests, []);

  return (
    <div className={"view-requests-page"}>
      <TabSwitcher
        titles={[
          "Flowers",
          "Religious",
          "Sanitation",
          "Interpreter",
          "Transport",
        ]}
        components={[
          <RequestsTable
            updateRequests={updateRequests}
            requests={requests?.flowers}
            type={"Flowers"}
          />,
          <RequestsTable
            updateRequests={updateRequests}
            requests={requests?.religious}
            type={"Religious"}
          />,
          <RequestsTable
            updateRequests={updateRequests}
            requests={requests?.sanitation}
            type={"Sanitation"}
          />,
          <RequestsTable
            updateRequests={updateRequests}
            requests={requests?.interpreter}
            type={"Interpreter"}
          />,
          <RequestsTable
            updateRequests={updateRequests}
            requests={requests?.transport}
            type={"Transport"}
          />,
        ]}
      />
    </div>
  );
};
