import React, { FormEvent, useReducer, useEffect, useState } from "react";
import { MapNode, nodeStore } from "../map/MapNode.ts";
import {
  postServiceRequest,
  ServiceRequest,
} from "../servicereqs/ServiceRequestNodes.ts";
import axios, { AxiosResponse } from "axios";

export const Flowers = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  nodeStore.currentRefresh = forceUpdate;
  const [employeeNames, setEmployeeNames] = useState<string[]>([]);

  useEffect(() => {
    // Fetch employee names using API call and update the state
    const fetchEmployeeNames = async () => {
      try {
        axios
          .get("http://localhost:3000/api/map/nodes")
          .then((response: AxiosResponse<MapNode[]>) => {
            const employees: string[] = [];
            console.log(response.data);
            response.data.forEach((node) => {
              employees.push(node.shortName);
            });
            console.log(employees);
            setEmployeeNames(employees);
          });

        // Replace with the actual property holding employee names in the API response
      } catch (error) {
        console.error("Error fetching employee names:", error);
      }
    };

    fetchEmployeeNames();
  }, []); // Empty dependency array to ensure the effect runs only once when the component mounts

  function getValue(event: FormEvent<HTMLFormElement>, name: string) {
    const elm = event.currentTarget.elements.namedItem(
      name,
    ) as HTMLInputElement;
    return elm.value;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Textarea Value:", getValue(event, "desc"));
    console.log(nodeStore.selectedNode);
    const requestData: ServiceRequest = {
      desc: getValue(event, "desc"),
      handled: false,
      location:
        nodeStore.selectedNode?.nodeID === undefined
          ? "invalid"
          : nodeStore.selectedNode?.nodeID,
      requestID: crypto.randomUUID(),
      requestType: "Flowers",
      requester: "admin",
    };
    postServiceRequest(requestData);
  };

  console.log("NOE");
  console.log(nodeStore.selectedNode?.longName);

  return (
    <div className={"service-button-text"}>
      <br />
      <div>Service Request Description:</div>

      <form
        id="confirmationForm"
        name="confirmationForm"
        method="post"
        onSubmit={handleSubmit}
      >
        <input type="text" className="desc" name={"desc"} />
        <br />
        <br />
        <input
          type="text"
          value={
            nodeStore.selectedNode === undefined
              ? "Select node"
              : nodeStore.selectedNode.longName
          }
          className="submitButton"
        />
        <br />
        <br />
        <select
          className="employeeDropdown"
          onChange={(event) => console.log(event.target.value)}
        >
          <option value="" disabled selected>
            Select Employee
          </option>
          {employeeNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <br />
        <br />
        <input type="submit" value="Submit" className="submitButton" />
      </form>
    </div>
  );
};
