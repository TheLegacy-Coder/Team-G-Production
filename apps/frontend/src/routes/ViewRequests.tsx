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
      filter === "All" ||
      (filter === "Assigned" && request.status === "Assigned") ||
      (filter === "In Progress" && request.status === "In Progress") ||
      (filter === "Completed" && request.status === "Completed")
    ) {
      const extraCols = [];
      switch (type) {
        case "All":
          extraCols.push(
              <td key="dropdown">
                <button>Dropdown</button>
              </td>,
          );
          break;
        case "Flowers":
          extraCols.push(
              <td key="flowerType">
                {(request as ServiceRequestFlowers).flowerType}
              </td>,
              <td key="amount">{(request as ServiceRequestFlowers).amount}</td>,
          );
          break;
        case "Religious":
          extraCols.push(
              <td key="faith">{(request as ServiceRequestReligious).faith}</td>,
          );
          break;
        case "Sanitation":
          extraCols.push(
              <td key="hazardous">
                {(request as ServiceRequestSanitation).hazardous.toString()}
              </td>,
              <td key="messType">
                {(request as ServiceRequestSanitation).messType}
              </td>,
          );
          break;
        case "Interpreter":
          extraCols.push(
              <td key="language">
                {(request as ServiceRequestInterpreter).language}
              </td>,
          );
          break;
        case "Transport":
          extraCols.push(
              <td key="vehicle">
                {(request as ServiceRequestExternalTransport).vehicle}
              </td>,
              <td key="destination">
                {(request as ServiceRequestExternalTransport).destination}
              </td>,
          );
          break;
      }

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
          {extraCols}
        </tr>
      );
    }
  });

  const extraHeaders = [];
  switch (type) {
    case "All":
      extraHeaders.push(<th key="extra">Extra</th>);
      break;
    case "Flowers":
      extraHeaders.push(
          <th key="flowerType">Flower Type</th>,
          <th key="amount">Amount</th>,
      );
      break;
    case "Religious":
      extraHeaders.push(<th key="faith">Faith</th>);
      break;
    case "Sanitation":
      extraHeaders.push(
          <th key="hazardous">Hazardous</th>,
          <th key="messType">Mess Type</th>,
      );
      break;
    case "Interpreter":
      extraHeaders.push(<th key="language">Language</th>);
      break;
    case "Transport":
      extraHeaders.push(
          <th key="vehicle">Vehicle</th>,
          <th key="destination">Destination</th>,
      );
      break;
  }

  return (
    <>
      <div className="filter">
        <label htmlFor="statusFilter" className="filterText">
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
          {extraHeaders}
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
            params: {getAll: true},
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

  let allRequests: Array<
    | ServiceRequestFlowers
    | ServiceRequestReligious
    | ServiceRequestSanitation
    | ServiceRequestInterpreter
    | ServiceRequestExternalTransport
  > = [];
  if (requests !== undefined) {
    allRequests = allRequests.concat(
      requests.flowers,
      requests.religious,
      requests.sanitation,
      requests.interpreter,
      requests.transport,
    );
  }

  return (
    <div className={"view-requests-page"}>
      <TabSwitcher
        titles={[
          "All",
          "Flowers",
          "Religious",
          "Sanitation",
          "Interpreter",
          "Transport",
        ]}
        components={[
          <RequestsTable
            updateRequests={updateRequests}
            requests={allRequests}
            type={"All"}
          />,
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
