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
  const [editingID, setEditingID] = useState<string>();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleMouseLeave = () => {
    if (state === "none") setEditingID(undefined);
  };

  useEffect(() => {
    const handleMouseEnter = (employeeID: string) => {
      if (state === "none") setEditingID(employeeID);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const data: Employee = {
        employeeID:
          state === "edit"
            ? (editingID as string)
            : (formData.get("employeeID") as string),
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        job: formData.get("job") as string,
        accessLevel: formData.get("accessLevel") as string,
      };
      console.log(data);
      if (state === "edit") {
        try {
          axios
            .patch("http://localhost:3000/api/employees", data, {})
            .then(() => setState("none"));
        } catch (error) {
          console.error("Error submitting employee:", error);
        }
      } else if (state === "add") {
        try {
          axios
            .post("http://localhost:3000/api/employees", data, {})
            .then(() => setState("none"));
        } catch (error) {
          console.error("Error submitting employee:", error);
        }
      }
    };

    getEmployees().then((list) => {
      const newRows: React.ReactElement[] = [];
      if (list !== undefined) {
        list.data.forEach((employee) => {
          const editButton =
            employee.employeeID === editingID && state === "none" ? (
              <button
                style={{ position: "absolute", right: "25px" }}
                onClick={() => setState("edit")}
              >
                Edit
              </button>
            ) : null;

          if (state === "edit" && employee.employeeID === editingID) {
            newRows.push(
              <>
                <form id={"empForm"} onSubmit={submit}></form>
                <tr>
                  <td>{employee.employeeID}</td>
                  <td>
                    <input
                      name="firstName"
                      form="empForm"
                      required={true}
                      defaultValue={employee.firstName}
                    />
                  </td>
                  <td>
                    <input
                      name="lastName"
                      form="empForm"
                      required={true}
                      defaultValue={employee.lastName}
                    />
                  </td>
                  <td>
                    <input
                      name="email"
                      form="empForm"
                      required={true}
                      defaultValue={employee.email}
                    />
                  </td>
                  <td>
                    <input
                      name="job"
                      form="empForm"
                      required={true}
                      defaultValue={employee.job}
                    />
                  </td>
                  <td>
                    <input
                      name="accessLevel"
                      form="empForm"
                      required={true}
                      defaultValue={employee.accessLevel}
                    />
                  </td>
                </tr>
              </>,
            );
          } else {
            newRows.push(
              <tr
                key={employee.employeeID}
                onMouseEnter={() => handleMouseEnter(employee.employeeID)}
              >
                <td>{employee.employeeID}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.job}</td>
                <td>
                  {employee.accessLevel}
                  {editButton}
                </td>
              </tr>,
            );
          }
        });
      }
      if (state === "add") {
        newRows.push(
          <>
            <form id={"empForm"} onSubmit={submit}></form>
            <tr>
              <td>
                <input name={"employeeID"} form={"empForm"} required={true} />
              </td>
              <td>
                <input name={"firstName"} form={"empForm"} required={true} />
              </td>
              <td>
                <input name={"lastName"} form={"empForm"} required={true} />
              </td>
              <td>
                <input name={"email"} form={"empForm"} required={true} />
              </td>
              <td>
                <input name={"job"} form={"empForm"} required={true} />
              </td>
              <td>
                <input name={"accessLevel"} form={"empForm"} required={true} />
              </td>
            </tr>
          </>,
        );
      }
      setRows(newRows);
      forceUpdate();
    });
  }, [state, editingID]);

  const addEmployee = () => {
    setState("add");
  };
  const cancel = () => {
    setState("none");
    setEditingID(undefined);
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
        <tbody onMouseLeave={handleMouseLeave}>{rows}</tbody>
      </table>
      {state === "add" || state === "edit" ? (
        <>
          <input type={"submit"} form={"empForm"}></input>
          <button onClick={cancel}>Cancel</button>
        </>
      ) : (
        <button onClick={addEmployee}>Add</button>
      )}
    </div>
  );
};
