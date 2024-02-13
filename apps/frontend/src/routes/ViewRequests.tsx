import React, { useEffect, useState } from "react";
import "./styles/ViewRequests.css";
import {
  getServiceRequests,
  ServiceRequest,
} from "../servicereqs/ServiceRequestNodes.ts";
import axios from "axios";

export const ViewRequests = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [stati] = useState(new Map<string, string>());

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

  // Render rows for requests
  const rows: React.ReactElement[] = [];
  requests.forEach((request) => {
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
      </tr>,
    );
  });

  return (
    <div className={"view-requests-page"}>
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
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
