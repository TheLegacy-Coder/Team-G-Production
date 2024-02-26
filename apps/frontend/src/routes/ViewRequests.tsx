import React, { ReactElement, useEffect, useState } from "react";
import "./styles/ViewRequests.css";
import { TabSwitcher } from "../components/TabSwitcher.tsx";
import {
  AllServiceRequests,
  JobAssignments,
  RequestType,
  ServiceRequest,
  ServiceRequestExternalTransport,
  ServiceRequestFlowers,
  ServiceRequestInterpreter,
  ServiceRequestReligious,
  ServiceRequestSanitation,
} from "common/src/ServiceRequests.ts";
import { currentEmployee } from "../stores/LoginStore.ts";
import {
  changeStatusAxios,
  getAllAxios,
  getFromEmployeeAxios,
} from "../DataAsObject/serviceRequestsAxios.ts";
import { Employee } from "common/src/Employee.ts";
import { getEmployeesAxios } from "../DataAsObject/employeesAxios.ts";
import { nodeStore } from "../map/MapNode.ts";

interface RequestsTableProps {
  updateRequests: () => void;
  requests: ServiceRequest[] | undefined;
  type: RequestType | string;
  roomLocation?: string;
  employees: Employee[];
}

export const RequestsTable = ({
  updateRequests,
  requests,
  type,
  roomLocation,
  employees,
}: RequestsTableProps) => {
  const [stati] = useState(new Map<string, string>());
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [employeeFilter, setEmployeeFilter] = useState<string>("All");

  // Change status of a request, PATCH to backend
  const handleStatusChange = (requestID: string, newStatus: string) => {
    changeStatusAxios(requestID, newStatus).then(() => {
      updateRequests();
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
    if (type === "AtNode" && roomLocation !== request.location) {
      return;
    }
    if (
      employeeFilter !== request.helpingEmployee &&
      employeeFilter !== "All"
    ) {
      return;
    }
    if (
      statusFilter === "All" ||
      (statusFilter === "Assigned" && request.status === "Assigned") ||
      (statusFilter === "In Progress" && request.status === "In Progress") ||
      (statusFilter === "Completed" && request.status === "Completed")
    ) {
      const extraCols = [];
      const extraInfo = [];
      switch (type) {
        case "All":
        case "AtNode":
          switch (request.requestType) {
            case "Flowers":
              extraInfo.push(
                <p key={"flowerType"}>
                  Flower Type: {(request as ServiceRequestFlowers).flowerType}
                </p>,
                <p key={"amount"}>
                  Amount: {(request as ServiceRequestFlowers).amount}
                </p>,
              );
              break;
            case "Religious":
              extraInfo.push(
                <p key={"faith"}>
                  Faith: {(request as ServiceRequestReligious).faith}
                </p>,
              );
              break;
            case "Sanitation":
              extraInfo.push(
                <p key={"hazardous"}>
                  Hazardous:{" "}
                  {(request as ServiceRequestSanitation).hazardous.toString()}
                </p>,
                <p key={"mess type"}>
                  Mess Type: {(request as ServiceRequestSanitation).messType}
                </p>,
              );
              break;
            case "Interpreter":
              extraInfo.push(
                <p key={"language"}>
                  Language: {(request as ServiceRequestInterpreter).language}
                </p>,
              );
              break;
            case "Transport":
              extraInfo.push(
                <p key={"vehicle"}>
                  Vehicle:{" "}
                  {(request as ServiceRequestExternalTransport).vehicle}
                </p>,
                <p key={"destination"}>
                  Destination:{" "}
                  {(request as ServiceRequestExternalTransport).destination}
                </p>,
              );
              break;
          }
          extraCols.push(<td key="extra info">{extraInfo}</td>);
          break;
        case RequestType.Flowers:
          extraCols.push(
            <td key="flowerType">
              {(request as ServiceRequestFlowers).flowerType}
            </td>,
            <td key="amount">{(request as ServiceRequestFlowers).amount}</td>,
          );
          break;
        case RequestType.Religious:
          extraCols.push(
            <td key="faith">{(request as ServiceRequestReligious).faith}</td>,
          );
          break;
        case RequestType.Sanitation:
          extraCols.push(
            <td key="hazardous">
              {(request as ServiceRequestSanitation).hazardous.toString()}
            </td>,
            <td key="messType">
              {(request as ServiceRequestSanitation).messType}
            </td>,
          );
          break;
        case RequestType.Interpreter:
          extraCols.push(
            <td key="language">
              {(request as ServiceRequestInterpreter).language}
            </td>,
          );
          break;
        case RequestType.Transport:
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
        </tr>,
      );
    }
  });

  const extraHeaders = [];
  switch (type) {
    case "All":
    case "AtNode":
      extraHeaders.push(<th key="extra">Extra Info</th>);
      break;
    case RequestType.Flowers:
      extraHeaders.push(
        <th key="flowerType">Flower Type</th>,
        <th key="amount">Amount</th>,
      );
      break;
    case RequestType.Religious:
      extraHeaders.push(<th key="faith">Faith</th>);
      break;
    case RequestType.Sanitation:
      extraHeaders.push(
        <th key="hazardous">Hazardous</th>,
        <th key="messType">Mess Type</th>,
      );
      break;
    case RequestType.Interpreter:
      extraHeaders.push(<th key="language">Language</th>);
      break;
    case RequestType.Transport:
      extraHeaders.push(
        <th key="vehicle">Vehicle</th>,
        <th key="destination">Destination</th>,
      );
      break;
  }

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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <br />
        {currentEmployee?.accessLevel === "admin" ? (
          <>
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
              {employees.map((emp) =>
                type === "All" ||
                type === "AtNode" ||
                JobAssignments.get(type as RequestType)?.includes(emp.job) ? (
                  <option
                    id={emp.employeeID}
                    value={emp.employeeID}
                    key={emp.employeeID}
                  >
                    {emp.firstName + " " + emp.lastName}
                  </option>
                ) : (
                  ""
                ),
              )}
            </select>
          </>
        ) : (
          ""
        )}
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
  const [roomLocation, setlocation] = useState<string>("Select Node");
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Get employees from DB and store them in state
  const getAndSetEmployees = () => {
    getEmployeesAxios("true", "").then((list) => {
      if (list !== undefined) {
        setEmployees(list.data);
      }
    });
  };

  // Fetch the employees from the server on load
  useEffect(getAndSetEmployees, []);

  nodeStore.currentRefresh = () => {
    if (nodeStore.selectedNode?.nodeID !== undefined) {
      setlocation(nodeStore.selectedNode?.nodeID);
    } else {
      setlocation("Select Node");
    }
  };

  // Get requests from DB and store them in state
  const updateRequests = () => {
    if (currentEmployee?.accessLevel === "admin") {
      getAllAxios().then((res) => {
        setRequests(res.data);
      });
    } else {
      getFromEmployeeAxios(currentEmployee?.employeeID as string).then(
        (res) => {
          setRequests(res.data);
        },
      );
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

  const titlesToTables = new Map<string, React.ReactElement>([
    [
      "All",
      <RequestsTable
        updateRequests={updateRequests}
        requests={allRequests}
        type={"All"}
        key={"All"}
        employees={employees}
      />,
    ],
    [
      "At Node: " + roomLocation,
      <RequestsTable
        updateRequests={updateRequests}
        requests={allRequests}
        type={"AtNode"}
        roomLocation={roomLocation}
        key={"AtNode"}
        employees={employees}
      />,
    ],
    [
      "Flowers",
      <RequestsTable
        updateRequests={updateRequests}
        requests={requests?.flowers}
        type={RequestType.Flowers}
        key={RequestType.Flowers}
        employees={employees}
      />,
    ],
    [
      "Religious",
      <RequestsTable
        updateRequests={updateRequests}
        requests={requests?.religious}
        type={RequestType.Religious}
        key={RequestType.Religious}
        employees={employees}
      />,
    ],
    [
      "Sanitation",
      <RequestsTable
        updateRequests={updateRequests}
        requests={requests?.sanitation}
        type={RequestType.Sanitation}
        key={RequestType.Sanitation}
        employees={employees}
      />,
    ],
    [
      "Interpreter",
      <RequestsTable
        updateRequests={updateRequests}
        requests={requests?.interpreter}
        type={RequestType.Interpreter}
        key={RequestType.Interpreter}
        employees={employees}
      />,
    ],
    [
      "Transport",
      <RequestsTable
        updateRequests={updateRequests}
        requests={requests?.transport}
        type={RequestType.Transport}
        key={RequestType.Transport}
        employees={employees}
      />,
    ],
  ]);
  let titles: string[] = [];
  let tables: ReactElement[] = [];
  if (currentEmployee?.accessLevel === "admin") {
    titles = Array.from(titlesToTables.keys());
    titles[1] = "At Node: " + roomLocation;
    tables = Array.from(titlesToTables.values());
  } else {
    // Loop through JobAssignments and find the request that matches the currentEmployee.job
    for (const [key, value] of JobAssignments) {
      if (value.includes(currentEmployee?.job as string)) {
        titles.push(RequestType[key]);
        break;
      }
    }
    titles.push("At Node: " + roomLocation);
    for (const title of titles) {
      tables.push(titlesToTables.get(title) as ReactElement);
    }
  }

  return (
    <div className={"view-requests-page"}>
      <TabSwitcher titles={titles} components={tables} />
    </div>
  );
};
