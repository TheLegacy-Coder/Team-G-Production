import axios from "axios";

export type Employee = {
  employeeID: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  job: string;
  accessLevel: string;
};

export type EmployeeWrapper = {
  data: Employee[];
};

export async function getEmployees(): Promise<EmployeeWrapper> {
  return axios.get("http://localhost:3000/api/employees", {
    params: { getAll: true },
  });
}
