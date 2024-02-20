import axios from "axios";

export function getEmployees(getAll: string, jobs: string) {
  if (getAll == "true") {
    return axios.get("http://localhost:3000/api/employees?getAll=true");
  } else {
    return axios.get("http://localhost:3000/api/employees?jobTypes=" + jobs);
  }
}
