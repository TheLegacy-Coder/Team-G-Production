import React, { useEffect, useState } from "react";
import "./styles/ViewEmployees.css";
import { Employee } from "common/src/Employee.ts";
import {
  addEmployeeAxios,
  addMultipleEmployeesAxios,
  deleteEmployeeAxios,
  editEmployeeAxios,
  getEmployeesAxios,
} from "../DataAsObject/employeesAxios.ts";

type State = "none" | "add" | "edit";

export interface EmployeeWrapper {
  data: Employee[];
}

async function getEmployees(): Promise<EmployeeWrapper> {
  return getEmployeesAxios("true", "");
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
      deleteEmployeeAxios(employeeID).then(() => {
        getAndSetEmployees();
        setState("none");
      });
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
        editEmployeeAxios(data).then(() => {
          getAndSetEmployees();
          setState("none");
        });
      } catch (error) {
        console.error("Error submitting employee:", error);
      }
    } else if (state === "add") {
      try {
        addEmployeeAxios([data]).then(() => {
          getAndSetEmployees();
          setState("none");
        });
      } catch (error) {
        console.error("Error submitting employee:", error);
      }
    }
  };

  const handleExportEmployees = () => {
    const rows: string[] = [];
    rows.push("employeeID,firstName,lastName,email,job,accessLevel");
    employees.forEach((row: Employee) => {
      rows.push(Object.values(row).slice(0, 6).join(","));
    });
    const csvArray = rows.join("\r\n");
    const a = document.createElement("a");
    a.href = "data:attachment/csv," + encodeURIComponent(csvArray);
    a.target = "_blank";
    a.download = "employees.csv";
    document.body.appendChild(a);
    a.click();
  };

  const handleImportEmployees = (e: React.ChangeEvent<HTMLInputElement>) => {
    const importedMapEmployees: Employee[] = [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const content = event.target.result;
        const lines = (content as string).split("\n");
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].replace("\r", "").split(",");
          if (line[0] === "") continue;
          const employee: Employee = {
            employeeID: line[0],
            firstName: line[1],
            lastName: line[2],
            email: line[3],
            job: line[4],
            accessLevel: line[5],
          };
          importedMapEmployees.push(employee);
        }
      }
      console.log(importedMapEmployees);

      // post all new employees & replace all old ones
      addMultipleEmployeesAxios("true", importedMapEmployees).then(() => {
        // update local store
        getAndSetEmployees();
      });
      e.target.value = "";
    };
    reader.readAsText(file);
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
          <div className="edit-delete-buttons">
            <button className="edit-button" onClick={editEmployee}>
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => deleteEmployee(employee.employeeID)}
            >
              Delete
            </button>
          </div>
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
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Job</th>
            <th>Access Level</th>
          </tr>
        </thead>
        <tbody onMouseLeave={handleMouseLeave}>{rows}</tbody>
      </table>

      {state === "add" || state === "edit" ? (
        // If the state is "add" or "edit", render a submit button and a cancel button

        <div className={"float-buttons"}>
          <input
            className="add-button"
            type={"submit"}
            form={"empForm"}
          ></input>
          <button className="add-button" onClick={cancel}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className={"float-buttons-right"}>
            <button
              className={"import-export-buttons"}
              onClick={handleExportEmployees}
            >
              Export CSV
            </button>
            <label className={"import-export-buttons"}>
              <input
                onChange={handleImportEmployees}
                type={"file"}
                accept={".csv"}
                hidden
              />
              Import CSV
            </label>
          </div>
          <div className={"float-buttons-left"}>
            <button className="add-button" onClick={addEmployee}>
              Add Employee
            </button>
          </div>
        </>
      )}
    </div>
  );
};
