import React, { useEffect, useState } from "react";
import "./styles/ViewRequests.css";
import {
  getServiceRequests,
  ServiceRequest,
  ServiceRequestList,
} from "../servicereqs/ServiceRequestNodes.ts";
import axios from "axios";
import { TabSwitcher } from "../components/TabSwitcher.tsx";
import {
  ServiceRequestExternalTransport,
  ServiceRequestFlowers,
  ServiceRequestInterpreter,
  ServiceRequestReligious,
  ServiceRequestSanitation,
} from "common/src/ServiceRequests.ts";

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
        <label htmlFor="statusFilter">Filter by Status:</label>
        <select
          name="statusFilter"
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
  const [requests, setRequests] = useState<ServiceRequestList>();

  // Get requests from DB and store them in state
  const updateRequests = () => {
    getServiceRequests().then((list) => {
      if (list !== undefined) {
        setRequests(list.data);
      }
    });
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
            requests={requests?.Flowers}
            type={"Flowers"}
          />,
          <RequestsTable
            updateRequests={updateRequests}
            requests={requests?.Religious}
            type={"Religious"}
          />,
          <RequestsTable
            updateRequests={updateRequests}
            requests={requests?.Sanitation}
            type={"Sanitation"}
          />,
          <RequestsTable
            updateRequests={updateRequests}
            requests={requests?.Interpreter}
            type={"Interpreter"}
          />,
          <RequestsTable
            updateRequests={updateRequests}
            requests={requests?.Transport}
            type={"Transport"}
          />,
        ]}
      />
    </div>
  );
};
