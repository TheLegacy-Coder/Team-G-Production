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
  const [hoveringID, setHoveringID] = useState<string>();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleMouseLeave = () => {
    if (state === "none") setHoveringID(undefined);
  };

  useEffect(() => {
    const handleMouseEnter = (employeeID: string) => {
      if (state === "none") setHoveringID(employeeID);
    };

    const deleteEmployee = (employeeID: string) => {
      if (
        window.confirm(
          `Are you sure you want to delete employee ${employeeID}?`,
        )
      ) {
        try {
          axios
            .delete("http://localhost:3000/api/employees", {
              data: { employeeID: employeeID },
            })
            .then(() => setState("none"));
        } catch (error) {
          console.error("Error deleting employee:", error);
        }
      }
    };

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const data: Employee = {
        employeeID:
          state === "edit"
            ? (hoveringID as string)
            : (formData.get("employeeID") as string),
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        job: formData.get("job") as string,
        accessLevel: formData.get("accessLevel") as string,
      };
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
          const buttons =
            employee.employeeID === hoveringID && state === "none" ? (
              <>
                <button
                  className="edit-button"
                  onClick={() => setState("edit")}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteEmployee(employee.employeeID)}
                >
                  Delete
                </button>
              </>
            ) : null;

          if (state === "edit" && employee.employeeID === hoveringID) {
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
                  {buttons}
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
  }, [state, hoveringID]);

  const addEmployee = () => {
    setState("add");
  };
  const cancel = () => {
    setState("none");
    setHoveringID(undefined);
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
