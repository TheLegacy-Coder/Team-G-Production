import React, { useEffect, useReducer, useState } from "react";
import "./styles/ViewRequests.css";
import { getServiceRequests } from "../servicereqs/ServiceRequestNodes.ts";
// import axios, {AxiosResponse} from "axios";

export const ViewRequests = () => {
  const [rows, setRows] = useState<React.ReactElement[]>([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    getServiceRequests().then((list) => {
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
              <td>{request.status}</td>
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
  }, []);

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
            <th>status</th>
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
