import React, { useEffect, useReducer, useState } from "react";
import "./styles/ViewRequests.css";
import {
  getServiceRequests,
  ServiceRequest,
} from "../servicereqs/ServiceRequestNodes.ts";
import axios from "axios";
import { Dropdown, DropdownButton, Stack } from "react-bootstrap";

export const ViewRequests = () => {
  const [rows, setRows] = useState<React.ReactElement[]>([]);
  const [statusChanged, setStatusChanged] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleStatusChange = (requestID: string, newStatus: string) => {
    axios
      .patch("http://localhost:3000/api/services/requests", {
        requestID: requestID,
        status: newStatus,
      })
      .then((response) => {
        console.log(response);
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
        const renderStatusChangeButton = (status: string) => {
          return (
            <Dropdown.Item
              as="button"
              disabled={request.status === status}
              onClick={() => handleStatusChange(request.requestID, status)}
            >
              Change to {status}
            </Dropdown.Item>
          );
        };

        return (
          <Stack direction="horizontal" gap={2}>
            {request.status}
            <DropdownButton
              id="dropdown-item-button"
              title=""
              variant={"secondary"}
            >
              {renderStatusChangeButton("Assigned")}
              {renderStatusChangeButton("In Progress")}
              {renderStatusChangeButton("Completed")}
            </DropdownButton>
          </Stack>
        );
      };

      const newRows: React.ReactElement[] = [];
      if (list !== undefined) {
        list.data.forEach((request) => {
          console.log("t");
          console.log(request);
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
      console.log(newRows);
      forceUpdate();
    });
  }, [statusChanged]);

  console.log(rows);
  return (
    <div className={"csvs-page"}>
      <h1>Service Requests</h1>

      <table>
        <thead>
          <tr>
            <th>requestID</th>
            <th>requestType</th>
            <th>location</th>
            <th>handled</th>
            <th>requester</th>
            <th>helpingEmployee</th>
            <th>desc</th>
            <th>time</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
