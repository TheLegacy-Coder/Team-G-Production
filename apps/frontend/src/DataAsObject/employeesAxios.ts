import axios from "axios";
import { currentToken } from "../stores/LoginStore.ts";
import { Employee } from "common/src/Employee.ts";

export function getEmployeesAxios(getAll: string, jobs: string) {
  if (getAll == "true") {
    return axios.get("http://localhost:3000/api/employees?getAll=true", {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
  } else {
    return axios.get("http://localhost:3000/api/employees?jobTypes=" + jobs, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
  }
}

export function deleteEmployeeAxios(employeeID: string) {
  return new Promise((resolve, reject) => {
    axios
      .delete("http://localhost:3000/api/employees", {
        data: { employeeID: employeeID },
        headers: { Authorization: `Bearer ${currentToken}` },
      })
      .then(() => {
        resolve("Deleted Employee");
        return;
      })
      .catch((error) => {
        reject(error);
        return;
      });
  });
}

export function editEmployeeAxios(data: Employee) {
  return new Promise((resolve, reject) => {
    axios
      .patch("http://localhost:3000/api/employees", data, {
        headers: { Authorization: `Bearer ${currentToken}` },
      })
      .then(() => {
        resolve("Added Employee");
        return;
      })
      .catch((error) => {
        reject(error);
        return;
      });
  });
}

export function addEmployeeAxios(data: Employee[]) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "http://localhost:3000/api/employees",
        { employees: data },
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        },
      )
      .then(() => {
        resolve("Edited Employee");
        return;
      })
      .catch((error) => {
        reject(error);
        return;
      });
  });
}

export function addMultipleEmployeesAxios(
  deleteAll: string,
  importedMapEmployees: Employee[],
) {
  return new Promise((resolve, reject) => {
    const deleteAllBoolean = deleteAll === "true";
    axios
      .post(
        "http://localhost:3000/api/employees",
        {
          deleteAll: deleteAllBoolean,
          employees: importedMapEmployees,
        },
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        },
      )
      .then(() => {
        resolve("Added Employees");
        return;
      })
      .catch((error) => {
        reject(error);
        return;
      });
  });
}
