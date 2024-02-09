import React, { useEffect, useReducer, useState } from "react";
import "./styles/ViewEmployees.css";
import { getEmployees } from "../employee/Employee.ts";

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
      <h1>Employees</h1>

      <table>
        <thead>
          <tr>
            <th>employeeID</th>
            <th>firstName</th>
            <th>lastName</th>
            <th>job</th>
            <th>accessLevel</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
