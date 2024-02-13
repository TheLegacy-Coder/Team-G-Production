import React, { useEffect, useReducer, useState } from "react";
import "./styles/ViewRequests.css";
import {
  getServiceRequests,
  ServiceRequest,
} from "../servicereqs/ServiceRequestNodes.ts";
import axios from "axios";

export const ViewRequests = () => {
  const [rows, setRows] = useState<React.ReactElement[]>([]);
  const [statusChanged, setStatusChanged] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [stati] = useState(new Map<string, string>());

  const handleStatusChange = (requestID: string, newStatus: string) => {
    axios
      .patch("http://localhost:3000/api/services/requests", {
        requestID: requestID,
        status: newStatus,
      })
      .then((response) => {
        setStatusChanged(true);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching service requests:", error);
        return undefined;
      });
  };

  useEffect(() => {
    setStatusChanged(false);
    getServiceRequests().then((list) => {
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

      const newRows: React.ReactElement[] = [];
      if (list !== undefined) {
        list.data.forEach((request) => {
          newRows.push(
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
      }
      setRows(newRows);
      forceUpdate();
    });
  }, [stati, statusChanged]);

  return (
    <div className={"csvs-page"}>
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
