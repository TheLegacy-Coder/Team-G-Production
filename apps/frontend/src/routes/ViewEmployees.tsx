import React, { useEffect, useReducer, useState } from "react";
import "./styles/ViewEmployees.css";
import axios from "axios";
import { Employee } from "common/src/Employee.ts";

export interface EmployeeWrapper {
  data: Employee[];
}

async function getEmployees(): Promise<EmployeeWrapper> {
  return axios.get("http://localhost:3000/api/employees", {
    params: { getAll: true },
  });
}

export const ViewEmployees = () => {
  const [rows, setRows] = useState<React.ReactElement[]>([]);
  const [statusChanged, setStatusChanged] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    setStatusChanged(false);
    getEmployees().then((list) => {
      const newRows: React.ReactElement[] = [];
      if (list !== undefined) {
        list.data.forEach((employee) => {
          newRows.push(
            <tr key={employee.employeeID}>
              <td>{employee.employeeID}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.job}</td>
              <td>{employee.accessLevel}</td>
            </tr>,
          );
        });
      }
      setRows(newRows);
      forceUpdate();
    });
  }, [statusChanged]);

  return (
    <div className={"employees-page"}>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Job</th>
            <th>Access Level</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
