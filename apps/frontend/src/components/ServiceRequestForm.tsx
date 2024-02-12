import React, { useEffect, useReducer, useState } from "react";
import {
  JobAssignments,
  RequestType,
  ServiceRequestEndpoints,
  ServiceRequestExternalTransport,
  ServiceRequestFlowers,
  ServiceRequestInterpreter,
  ServiceRequestReligious,
  ServiceRequestSanitation,
} from "common/src/ServiceRequests.ts";
import { nodeStore } from "../map/MapNode.ts";

import axios, { AxiosResponse } from "axios";
import { Employee } from "common/src/Employee.ts";
import { ServiceRequest } from "../servicereqs/ServiceRequestNodes.ts";
import { currentEmployee } from "../stores/LoginStore.ts";
import "./styles/ServiceRequestForm.css";
import { ServiceRequests } from "./ServiceRequests.tsx";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";

export interface ServiceRequestProps {
  requestType: RequestType;
}

export function ServiceRequestForm(props: ServiceRequestProps) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  nodeStore.currentRefresh = forceUpdate;
  const [submitted, setSubmitted] = useState(false);
  //States cannot be declared conditionally so we delcare all states regaurdless of type
  //const [status,setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [helpingEmployee, setHelpingEmployee] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [desc, setDesc] = useState("");

  //Flowers
  const [flowerType, setFlowerType] = useState("");
  const [amount, setAmount] = useState(1);

  //Religious
  const [faith, setFaith] = useState("");

  //Sanitation
  const [hazardous, setHazardous] = useState(false);
  const [messType, setMessType] = useState("");

  //Interpreter
  const [language, setLanguage] = useState("");

  //Transport
  const [vehicle, setVehicle] = useState("");
  const [destination, setDestination] = useState("");

  function handleSubmit() {
    let req: ServiceRequest = {
      desc: "",
      location: "",
      requestID: "",
      requestType: "",
      requester: "",
      status: "",
    };
    switch (props.requestType) {
      case RequestType.Religious:
        req = {
          requestID: crypto.randomUUID(),
          requestType: "Flowers",
          location: nodeStore.selectedNode?.nodeID,
          status: "Assigned",
          priority: priority,
          requester: currentEmployee?.employeeID,
          helpingEmployee: helpingEmployee,
          desc: desc,
          faith: faith,
        } as ServiceRequestReligious;
        break;
      case RequestType.Sanitation:
        req = {
          requestID: crypto.randomUUID(),
          requestType: "Flowers",
          location: nodeStore.selectedNode?.nodeID,
          status: "Assigned",
          priority: priority,
          requester: currentEmployee?.employeeID,
          helpingEmployee: helpingEmployee,
          desc: desc,
          hazardous: hazardous,
          messType: messType,
        } as ServiceRequestSanitation;
        break;
      case RequestType.Interpreter:
        req = {
          requestID: crypto.randomUUID(),
          requestType: "Flowers",
          location: nodeStore.selectedNode?.nodeID,
          status: "Assigned",
          priority: priority,
          requester: currentEmployee?.employeeID,
          helpingEmployee: helpingEmployee,
          desc: desc,
          language: language,
        } as ServiceRequestInterpreter;
        break;
      case RequestType.Transport:
        req = {
          requestID: crypto.randomUUID(),
          requestType: "Flowers",
          location: nodeStore.selectedNode?.nodeID,
          status: "Assigned",
          priority: priority,
          requester: currentEmployee?.employeeID,
          helpingEmployee: helpingEmployee,
          desc: desc,
          vehicle: vehicle,
          destination: destination,
        } as ServiceRequestExternalTransport;
        break;
      case RequestType.Flowers:
        req = {
          requestID: crypto.randomUUID(),
          requestType: "Flowers",
          location: nodeStore.selectedNode?.nodeID,
          status: "Assigned",
          priority: priority,
          requester: currentEmployee?.employeeID,
          helpingEmployee: helpingEmployee,
          desc: desc,
          flowerType: flowerType,
          amount: amount,
        } as ServiceRequestFlowers;
        break;
    }
    console.log(req);
    try {
      axios
        .post(
          "http://localhost:3000/api/" +
            ServiceRequestEndpoints.get(props.requestType),
          req,
        )
        .then((response: AxiosResponse<Employee[]>) => {
          console.log(response);
        });

      // Replace with the actual property holding employee names in the API response
    } catch (error) {
      console.error("Error fetching employee names:", error);
    }
    setSubmitted(true);
  }

  let jobs = "";
  JobAssignments.get(props.requestType)?.forEach((job) => {
    if (jobs !== "") {
      jobs += ",";
    }
    jobs += job;
  });

  useEffect(() => {
    // Fetch employee names using API call and update the state
    const fetchEmployeeNamesAndIDS = async () => {
      try {
        axios
          .get("http://localhost:3000/api/employees?jobTypes=" + jobs)
          .then((response: AxiosResponse<Employee[]>) => {
            setEmployees(response.data);
          });

        // Replace with the actual property holding employee names in the API response
      } catch (error) {
        console.error("Error fetching employee names:", error);
      }
    };
    fetchEmployeeNamesAndIDS();
  }, [jobs]);

  return (
    <div className={"service-request-container"}>
      {submitted ? (
        <>
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
          <h1 className={"service-request-submitted-text"}>
            Request Submitted
          </h1>
          <br />
          <ContextMenuRouterButton
            content={<ServiceRequests />}
            lable={"Service Request"}
            protected={true}
            style={"nav-button"}
            customText={"Back"}
          />
        </>
      ) : (
        <div className={"service-request-form"}>
          <h3 className={"service-request-form-label"}>Description</h3>
          <textarea
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
            className={"service-request-form-text-large"}
          />

          <h3 className={"service-request-form-label"}>Location</h3>
          <input
            value={
              nodeStore.selectedNode === undefined
                ? "Select Node"
                : nodeStore.selectedNode.longName
            }
            type={"text"}
            className={"service-request-form-text-node"}
          />

          <h3 className={"service-request-form-label"}>Priority</h3>
          <select
            name="priority"
            id="priority"
            className={"service-request-form-selector"}
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
            }}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Emergency">Emergency</option>
          </select>

          <h3 className={"service-request-form-label"}>Assigned Employee</h3>
          <select
            name="priority"
            id="priority"
            className={"service-request-form-selector"}
            value={helpingEmployee}
            onChange={(e) => {
              setHelpingEmployee(e.target.value);
            }}
          >
            <option value={""}>Select Employee</option>
            {employees.map((emp) => (
              <option id={emp.employeeID} value={emp.employeeID}>
                {emp.firstName + " " + emp.lastName}
              </option>
            ))}
          </select>

          {/*Flowers*/}
          {props.requestType == RequestType.Flowers ? (
            <>
              <h3 className={"service-request-form-label"}>Flower Type</h3>
              <select
                name="priority"
                id="priority"
                className={"service-request-form-selector"}
                value={flowerType}
                onChange={(e) => {
                  setFlowerType(e.target.value);
                }}
              >
                <option value="">Select Flower</option>
                <option value="Roses">Roses</option>
                <option value="Daisies">Daisies</option>
                <option value="Orchids">Orchids</option>
                <option value="Tulips">Tulips</option>
              </select>

              <h3 className={"service-request-form-label"}>Amount</h3>
              <select
                name="priority"
                id="priority"
                className={"service-request-form-selector"}
                value={amount}
                onChange={(e) => {
                  setAmount(parseInt(e.target.value));
                }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
              </select>
            </>
          ) : (
            <></>
          )}

          {/*Religious*/}
          {props.requestType == RequestType.Religious ? (
            <>
              <h3 className={"service-request-form-label"}>Faith</h3>
              <select
                name="faith"
                id="faith"
                className={"service-request-form-selector"}
                value={faith}
                onChange={(e) => {
                  setFaith(e.target.value);
                }}
              >
                <option value="">Select Faith</option>
                <option value="Christianity">Christianity</option>
                <option value="Judaism">Judaism</option>
                <option value="Islam">Islam</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Buddhism">Buddhism</option>
              </select>
            </>
          ) : (
            <></>
          )}

          {/*Sanitation*/}
          {props.requestType == RequestType.Sanitation ? (
            <>
              <h3 className={"service-request-form-label"}>Hazardous</h3>
              <input
                type="checkbox"
                checked={hazardous}
                onChange={(e) => {
                  setHazardous(e.target.checked);
                }}
              />
              <br />

              <h3 className={"service-request-form-label"}>Mess Type</h3>
              <select
                name="faith"
                id="faith"
                className={"service-request-form-selector"}
                value={messType}
                onChange={(e) => {
                  setMessType(e.target.value);
                }}
              >
                <option value="">Select Mess</option>
                <option value="Vomit">Vomit</option>
                <option value="Blood">Blood</option>
                <option value="Excrement">Excrement</option>
                <option value="Spill">Spill</option>
                <option value="Other">Other</option>
              </select>
            </>
          ) : (
            <></>
          )}

          {/*Interpreter*/}
          {props.requestType == RequestType.Interpreter ? (
            <>
              <h3 className={"service-request-form-label"}>Language</h3>
              <select
                name="language"
                id="language"
                className={"service-request-form-selector"}
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                }}
              >
                <option value="">Select Language</option>
                <option value="Spanish">Spanish</option>
                <option value="Mandarin">Mandarin</option>
                <option value="French">French</option>
                <option value="ASL">ASL</option>
                <option value="Russian">Russian</option>
                <option value="Japanese">Japanese</option>
                <option value="Arabic">Arabic</option>
              </select>
            </>
          ) : (
            <></>
          )}

          {/*Transport*/}
          {props.requestType == RequestType.Transport ? (
            <>
              <h3 className={"service-request-form-label"}>Vehicle</h3>
              <select
                name="language"
                id="language"
                className={"service-request-form-selector"}
                value={vehicle}
                onChange={(e) => {
                  setVehicle(e.target.value);
                }}
              >
                <option value="">Select Vehicle</option>
                <option value="Helicopter">Helicopter</option>
                <option value="Ambulance">Ambulance</option>
                <option value="Car">Car</option>
              </select>

              <h3 className={"service-request-form-label"}>Destination</h3>
              <input
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                }}
                type={"text"}
                className={"service-request-form-text"}
              />
            </>
          ) : (
            <></>
          )}
          <br />
          <button
            className={"service-request-form-submit"}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
