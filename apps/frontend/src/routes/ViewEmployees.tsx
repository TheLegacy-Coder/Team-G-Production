import React, { useEffect, useReducer, useState } from "react";
import "./styles/ViewEmployees.css";
import axios from "axios";
import { Employee } from "common/src/Employee.ts";

type State = "none" | "add" | "edit";

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

  const [state, setState] = useState<State>("none");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    getEmployees().then((list) => {
      const newRows: React.ReactElement[] = [];
      if (list !== undefined) {
        list.data.forEach((employee) => {
          newRows.push(
            <tr key={employee.employeeID}>
              <td>{employee.employeeID}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.job}</td>
              <td>{employee.accessLevel}</td>
            </tr>,
          );
        });
      }
      if (state === "add") {
        newRows.push(
          <>
            <form id={"newEmployee"} onSubmit={submit}></form>
            <tr>
              <td>
                <input
                  name={"employeeID"}
                  form={"newEmployee"}
                  required={true}
                />
              </td>
              <td>
                <input
                  name={"firstName"}
                  form={"newEmployee"}
                  required={true}
                />
              </td>
              <td>
                <input name={"lastName"} form={"newEmployee"} required={true} />
              </td>
              <td>
                <input name={"email"} form={"newEmployee"} required={true} />
              </td>
              <td>
                <input name={"job"} form={"newEmployee"} required={true} />
              </td>
              <td>
                <input
                  name={"accessLevel"}
                  form={"newEmployee"}
                  required={true}
                />
              </td>
            </tr>
          </>,
        );
      }
      setRows(newRows);
      forceUpdate();
    });
  }, [state]);

  const addEmployee = () => {
    setState("add");
  };
  const cancel = () => {
    setState("none");
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("form submitted");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data: Employee = {
      employeeID: formData.get("employeeID") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      job: formData.get("job") as string,
      accessLevel: formData.get("accessLevel") as string,
    };
    console.log(data);
    try {
      axios
        .post("http://localhost:3000/api/employees", data, {})
        .then((response) => {
          console.log(response);
          setState("none");
        });
    } catch (error) {
      console.error("Error submitting employee:", error);
    }
  };

  return (
    <div className={"employees-page"}>
      <h1>Employees</h1>

      <table>
        <thead>
          <tr>
            <th>employeeID</th>
            <th>firstName</th>
            <th>lastName</th>
            <th>email</th>
            <th>job</th>
            <th>accessLevel</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>

      {state === "add" || state === "edit" ? (
        <>
          <input type={"submit"} form={"newEmployee"}></input>
          <button onClick={cancel}>Cancel</button>
        </>
      ) : (
        <button onClick={addEmployee}>Add</button>
      )}
    </div>
  );
};
