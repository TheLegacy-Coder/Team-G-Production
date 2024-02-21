import React, { useEffect, useState } from "react";
import {
  PieChart,
  PieArcSeries,
  RadialGauge,
  RadialGaugeSeries,
  ChartDataShape,
} from "reaviz";
import {
  AllServiceRequests,
  ServiceRequest,
} from "common/src/ServiceRequests.ts";
import axios, { AxiosResponse } from "axios";
import "./styles/Charts.css";
import { Employee } from "common/src/Employee.ts";

interface EmployeeStats {
  completed: number;
}

export const Charts = () => {
  const [requestTypes, setRequests] = useState<AllServiceRequests | undefined>(
    undefined,
  );
  const [employees, setEmployees] = useState<Employee[] | undefined>(undefined);
  const employeeRegistry: Map<string, Employee> = new Map<string, Employee>();
  const statsMap = new Map<string, EmployeeStats>();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/employees/", {
        params: { getAll: true },
      })
      .then((res: AxiosResponse<Employee[]>) => {
        setEmployees(res.data);
      });
    axios
      .get("http://localhost:3000/api/services/requests", {
        params: { getAll: true },
      })
      .then((res: AxiosResponse<AllServiceRequests>) => {
        setRequests(res.data);
      });
  }, []);
  console.log(employees);

  employees?.forEach((employee: Employee) => {
    employeeRegistry.set(employee.employeeID, employee);
    statsMap.set(employee.employeeID, { completed: 0 });
  });
  console.log(employeeRegistry);

  let serviceRequestType = [
    { key: "Flowers", data: 0 },
    { key: "Religious", data: 0 },
    { key: "Sanitation", data: 0 },
    { key: "Interpreter", data: 0 },
    { key: "Transport", data: 0 },
  ];
  if (requestTypes !== undefined) {
    serviceRequestType = [
      { key: "Flowers", data: requestTypes.flowers.length },
      { key: "Religious", data: requestTypes.religious.length },
      { key: "Sanitation", data: requestTypes.sanitation.length },
      { key: "Interpreter", data: requestTypes.interpreter.length },
      { key: "Transport", data: requestTypes.transport.length },
    ];
  }

  console.log(serviceRequestType);

  let assigned = 0;
  let inProgress = 0;
  let completed = 0;

  requestTypes?.flowers.forEach((request: ServiceRequest) => {
    switch (request.status) {
      case "Assigned":
        assigned++;
        break;
      case "In Progress":
        inProgress++;
        break;
      case "Completed":
        completed++;
        if (request.helpingEmployee !== null) {
          if (request.helpingEmployee !== undefined) {
            (statsMap.get(request.helpingEmployee as string) as EmployeeStats)
              .completed++;
          }
        }

        break;
    }
  });

  requestTypes?.religious.forEach((request: ServiceRequest) => {
    switch (request.status) {
      case "Assigned":
        assigned++;
        break;
      case "In Progress":
        inProgress++;
        break;
      case "Completed":
        completed++;
        if (request.helpingEmployee !== null) {
          if (request.helpingEmployee !== undefined) {
            (statsMap.get(request.helpingEmployee as string) as EmployeeStats)
              .completed++;
          }
        }
        break;
    }
  });

  requestTypes?.sanitation.forEach((request: ServiceRequest) => {
    switch (request.status) {
      case "Assigned":
        assigned++;
        break;
      case "In Progress":
        inProgress++;
        break;
      case "Completed":
        completed++;
        if (request.helpingEmployee !== null) {
          if (request.helpingEmployee !== undefined) {
            (statsMap.get(request.helpingEmployee as string) as EmployeeStats)
              .completed++;
          }
        }
        break;
    }
  });

  requestTypes?.interpreter.forEach((request: ServiceRequest) => {
    switch (request.status) {
      case "Assigned":
        assigned++;
        break;
      case "In Progress":
        inProgress++;
        break;
      case "Completed":
        completed++;
        if (request.helpingEmployee !== null) {
          if (request.helpingEmployee !== undefined) {
            (statsMap.get(request.helpingEmployee as string) as EmployeeStats)
              .completed++;
          }
        }
        break;
    }
  });

  requestTypes?.transport.forEach((request: ServiceRequest) => {
    switch (request.status) {
      case "Assigned":
        assigned++;
        break;
      case "In Progress":
        inProgress++;
        break;
      case "Completed":
        completed++;
        if (request.helpingEmployee !== null) {
          if (request.helpingEmployee !== undefined) {
            (statsMap.get(request.helpingEmployee as string) as EmployeeStats)
              .completed++;
          }
        }
        break;
    }
  });

  const serviceRequestStatus = [
    { key: "Assigned", data: assigned },
    { key: "In Progress", data: inProgress },
    { key: "Completed", data: completed },
  ];

  const topEmps: ChartDataShape[] = [];
  let maxValue = 0;
  employees?.forEach((employee: Employee) => {
    if (employeeRegistry.has(employee.employeeID)) {
      const employeeStats = statsMap.get(employee.employeeID) as EmployeeStats;
      topEmps.push({
        key: employee.firstName + " " + employee.lastName,
        data: employeeStats.completed,
      });
      if (employeeStats.completed > maxValue) {
        maxValue = employeeStats.completed;
      }
    }
  });

  topEmps.sort((a: ChartDataShape, b: ChartDataShape) => {
    return (b.data as number) - (a.data as number);
  });

  topEmps.length = 3;

  const colorScheme: string[] = ["#065b1bFF", "#20486FFF", "#6F2048FF"];

  return (
    <div className={"chart-container"}>
      <div className={"first-row"}>
        <div className={"request-type-container"}>
          <h4>Service Request Type</h4>
          <PieChart
            className={"request-type-container"}
            data={serviceRequestType}
            series={
              <PieArcSeries
                colorScheme={[
                  "#065b1bFF",
                  "#6F2048FF",
                  "#20486FFF",
                  "#D4A261FF",
                  "#6F4886FF",
                ]}
              />
            }
          />
        </div>
      </div>
      <div className={"second-row"}>
        <div className={"request-status-container"}>
          <h4>Service Request Status</h4>
          <PieChart
            className={"request-status-container"}
            data={serviceRequestStatus}
            series={
              <PieArcSeries
                colorScheme={["#6F2048FF", "#20486FFF", "#065b1bFF"]}
              />
            }
          />
        </div>
      </div>
      <div className={"third-row"}>
        <div className={"request-leaderboard-container"}>
          <h4>Service Request Leaderboard</h4>
          <RadialGauge
            className={"request-leaderboard-container"}
            data={topEmps}
            startAngle={0}
            endAngle={Math.PI * 2}
            minValue={0}
            maxValue={maxValue}
            height={200}
            series={<RadialGaugeSeries colorScheme={colorScheme} />}
          />
        </div>
      </div>
    </div>
  );
};
