import React, { FormEvent, useReducer, useEffect, useState } from "react";
import { nodeStore } from "../map/MapNode.ts";
import { postServiceRequest } from "../servicereqs/ServiceRequestNodes.ts";
import axios, { AxiosResponse } from "axios";
import { Employee } from "../employee/Employee.ts";
import { Prisma } from "database";
import { currentEmployee } from "../stores/LoginStore.ts";

export const Flowers = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  nodeStore.currentRefresh = forceUpdate;
  const [employeeNames, setEmployeeNames] = useState<string[]>([]);
  const [employeeIDs, setEmployeeIDs] = useState<string[]>([]);

  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  useEffect(() => {
    // Fetch employee names using API call and update the state
    const fetchEmployeeNamesAndIDS = async () => {
      try {
        axios
          .get("http://localhost:3000/api/employees?jobTypes=flowerdeliveryman")
          .then((response: AxiosResponse<Employee[]>) => {
            const employees: string[] = [];
            const employeeIDs: string[] = [];
            response.data.forEach((emp) => {
              employees.push(emp.firstName + " " + emp.lastName);
              employeeIDs.push(emp.employeeID);
            });
            setEmployeeNames(employees);
            setEmployeeIDs(employeeIDs);
          });

        // Replace with the actual property holding employee names in the API response
      } catch (error) {
        console.error("Error fetching employee names:", error);
      }
    };

    fetchEmployeeNamesAndIDS();
  }, []); // Empty dependency array to ensure the effect runs only once when the component mounts

  function getValue(event: FormEvent<HTMLFormElement>, name: string) {
    const elm = event.currentTarget.elements.namedItem(
      name,
    ) as HTMLInputElement;
    return elm.value;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const index: number = employeeNames.indexOf(selectedEmployee);
    const requestData: Prisma.ServiceRequestUncheckedCreateInput = {
      desc: getValue(event, "desc"),
      status: "Assigned",
      location:
        nodeStore.selectedNode?.nodeID === undefined
          ? "invalid"
          : nodeStore.selectedNode?.nodeID,
      requestID: crypto.randomUUID(),
      requestType: "Flowers",
      helpingEmployee: employeeIDs[index],
      requester: currentEmployee?.employeeID,
    };
    postServiceRequest(requestData);
  };

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
          onChange={(event) => setSelectedEmployee(event.target.value)}
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
