import React, { useEffect, useState } from "react";
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
  // Store list of employees from GET request
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Store current state: none, add, or edit
  const [state, setState] = useState<State>("none");

  // EmployeeID of the employee being hovered over or edited
  const [hoveringID, setHoveringID] = useState<string>();

  // Get employees from DB and store them in state
  const getAndSetEmployees = () => {
    getEmployees().then((list) => {
      if (list !== undefined) {
        setEmployees(list.data);
      }
    });
  };

  // Fetch the employees from the server on load
  useEffect(getAndSetEmployees, []);

  // Set the employeeID of the employee being hovered over
  const handleMouseEnter = (employeeID: string) => {
    if (state === "none") setHoveringID(employeeID);
  };

  const handleMouseLeave = () => {
    if (state === "none") setHoveringID(undefined);
  };

  // State changers
  const addEmployee = () => {
    setState("add");
  };

  const editEmployee = () => {
    setState("edit");
  };

  const cancel = () => {
    setState("none");
    setHoveringID(undefined);
  };

  // Delete an employee from the database
  const deleteEmployee = (employeeID: string) => {
    if (
      window.confirm(`Are you sure you want to delete employee ${employeeID}?`)
    ) {
      try {
        axios
          .delete("http://localhost:3000/api/employees", {
            data: { employeeID: employeeID },
          })
          .then(() => {
            getAndSetEmployees();
            setState("none");
          });
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  // Submit an employee to the database to add or edit
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
          .then(() => {
            getAndSetEmployees();
            setState("none");
          });
      } catch (error) {
        console.error("Error submitting employee:", error);
      }
    } else if (state === "add") {
      try {
        axios.post("http://localhost:3000/api/employees", data, {}).then(() => {
          getAndSetEmployees();
          setState("none");
        });
      } catch (error) {
        console.error("Error submitting employee:", error);
      }
    }
  };

  // Render rows for each employee
  const rows: React.ReactElement[] = [];
  employees.forEach((employee) => {
    if (state === "edit" && employee.employeeID === hoveringID) {
      // If the employee is being edited, render a row with input fields
      rows.push(
        <>
          <form id={"empForm"} onSubmit={submit}></form>
          <tr>
            <td>{employee.employeeID}</td>
            {["firstName", "lastName", "email", "job", "accessLevel"].map(
              (field) => (
                <td key={field}>
                  <input
                    className="inputField"
                    name={field}
                    form="empForm"
                    required
                    defaultValue={
                      employee[
                        field as
                          | "firstName"
                          | "lastName"
                          | "email"
                          | "job"
                          | "accessLevel"
                      ]
                    }
                  />
                </td>
              ),
            )}
          </tr>
        </>,
      );
    } else {
      // If the employee is not being edited, render a normal row
      // With buttons for editing and deleting if the row is being hovered over
      const buttons =
        employee.employeeID === hoveringID && state === "none" ? (
          <>
            <button className="edit-button" onClick={editEmployee}>
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

      rows.push(
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

  // Add a row at the bottom for adding a new employee if the state is "add"
  if (state === "add") {
    rows.push(
      <>
        <form id={"empForm"} onSubmit={submit}></form>
        <tr>
          {[
            "employeeID",
            "firstName",
            "lastName",
            "email",
            "job",
            "accessLevel",
          ].map((field) => (
            <td key={field}>
              <input
                className="inputField"
                name={field}
                form={"empForm"}
                required={true}
              />
            </td>
          ))}
        </tr>
      </>,
    );
  }

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
        // If the state is "add" or "edit", render a submit button and a cancel button
        <>
          <input type={"submit"} form={"empForm"}></input>
          <button onClick={cancel}>Cancel</button>
        </>
      ) : (
        // Otherwise, render an add button
        <button onClick={addEmployee}>Add</button>
      )}
    </div>
  );
};
