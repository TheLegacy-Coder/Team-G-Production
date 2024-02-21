import axios from "axios";

export function getEmployeesAxios(getAll: string, jobs: string) {
  if (getAll == "true") {
    return axios.get("http://localhost:3000/api/employees?getAll=true");
  } else {
    return axios.get("http://localhost:3000/api/employees?jobTypes=" + jobs);
  }
}

export function deleteEmployeeAxios(employeeID: string) {
  return new Promise((resolve, reject) => {
    throw axios
      .delete("http://localhost:3000/api/employees", {
        data: { employeeID: employeeID },
      })
      .then(() => {
        resolve("Deleted Employee");
        return;
      })
      .catch((error) => {
        reject("Failed to delete Employee");
        throw error;
      });
  });
}

//export function addEmployeeAxios() {}
