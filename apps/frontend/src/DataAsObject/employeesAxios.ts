import axios from "axios";
import { currentToken } from "../stores/LoginStore.ts";
import { Employee } from "common/src/Employee.ts";
import { link } from "./links.ts";

export function getEmployeesAxios(getAll: string, jobs: string) {
  if (getAll == "true") {
    return axios.get(link + "/api/employees?getAll=true", {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
  } else {
    return axios.get(link + "/api/employees?jobTypes=" + jobs, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });
  }
}

export function deleteEmployeeAxios(employeeID: string) {
  return new Promise((resolve, reject) => {
    axios
      .delete(link + "/api/employees", {
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
      .patch(link + "/api/employees", data, {
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
        link + "/api/employees",
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
    if (deleteAll == "true") {
      axios
        .post(link + "/api/employees", {
          deleteAll: true,
          employees: importedMapEmployees,
        })
        .then(() => {
          resolve("Added Employees");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    } else {
      axios
        .post(link + "/api/employees", {
          deleteAll: false,
          employees: importedMapEmployees,
        })
        .then(() => {
          resolve("Added Employees");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    }
  });
}
