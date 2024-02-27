import "./styles/ImportExport.css";
import { Employee } from "common/src/Employee.ts";
import { getEmployeesAxios } from "../DataAsObject/employeesAxios.ts";
import { EmployeeWrapper } from "./ViewEmployees.tsx";
import { useEffect, useState } from "react";
import { Edge, mapEdges, MapNode, mapNodes } from "../map/MapNode.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { IHTMLInputElement } from "happy-dom";
async function getEmployees(): Promise<EmployeeWrapper> {
  return getEmployeesAxios("true", "");
}

export const ImportExport = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const getAndSetEmployees = () => {
    getEmployees().then((list) => {
      if (list !== undefined) {
        setEmployees(list.data);
      }
    });
  };

  // Fetch the employees from the server on load
  useEffect(getAndSetEmployees, []);

  const handleExport = () => {
    let rows: string[] = [];
    rows.push("employeeID,firstName,lastName,email,job,accessLevel");
    employees.forEach((row: Employee) => {
      rows.push(Object.values(row).slice(0, 6).join(","));
    });
    let csvArray = rows.join("\r\n");
    let a = document.createElement("a");
    a.href = "data:attachment/csv," + encodeURIComponent(csvArray);
    a.target = "_blank";
    a.download = "employees.csv";
    document.body.appendChild(a);
    a.click();

    rows = [];
    rows.push(
      "nodeID,xcoord,ycoord,floor,building,nodeType,longName,shortName",
    );
    mapNodes.forEach((row: MapNode) => {
      if (Object.values(row)[0] !== "") {
        rows.push(Object.values(row).slice(0, 8).join(","));
      }
    });
    csvArray = rows.join("\r\n");
    a = document.createElement("a");
    a.href = "data:attachment/csv," + encodeURIComponent(csvArray);
    a.target = "_blank";
    a.download = "nodes.csv";
    document.body.appendChild(a);
    a.click();

    rows = [];
    rows.push("edgeID,startNode,endNode");
    mapEdges.forEach((row: Edge) => {
      rows.push(Object.values(row).slice(0, 3).join(","));
    });
    csvArray = rows.join("\r\n");
    a = document.createElement("a");
    a.href = "data:attachment/csv," + encodeURIComponent(csvArray);
    a.target = "_blank";
    a.download = "edges.csv";
    document.body.appendChild(a);
    a.click();
  };

  const handleImport = () => {
    const employeeFile = (
      document.getElementById("Employees") as IHTMLInputElement
    ).files[0];
    const nodeFile = (document.getElementById("Nodes") as IHTMLInputElement)
      .files[0];
    const edgeFile = (document.getElementById("Edges") as IHTMLInputElement)
      .files[0];

    const importedMapEmployees: Employee[] = [];
    let reader = new FileReader();
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
    };
    reader.readAsText(employeeFile);

    const importedMapEdges: Edge[] = [];
    reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const content = event.target.result;
        const lines = (content as string).split("\n");
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].replace("\r", "").split(",");
          if (line[0] === "") continue;
          const edge: Edge = {
            edgeID: line[0],
            startNode: line[1],
            endNode: line[2],
          };
          importedMapEdges.push(edge);
        }
      }
      console.log(importedMapEdges);
    };
    reader.readAsText(edgeFile);

    const importedMapNodes: {
      nodeID: string;
      xcoord: number;
      ycoord: number;
      floor: string;
      building: string;
      nodeType: string;
      longName: string;
      shortName: string;
    }[] = [];
    reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        const content = event.target.result;
        const lines = (content as string).replace("\r", "").split("\n");
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].split(",");
          if (line[0] === "") continue;
          const node = {
            nodeID: line[0],
            xcoord: parseInt(line[1]),
            ycoord: parseInt(line[2]),
            floor: line[3],
            building: line[4],
            nodeType: line[5],
            longName: line[6],
            shortName: line[7],
          };
          importedMapNodes.push(node);
        }
      }
    };
    reader.readAsText(nodeFile);
  };

  return (
    <div className={"data-page"}>
      <button className="add-button" onClick={handleExport}>
        Export All
      </button>
      <form id="fileUploads">
        <input type="file" id="Employees" accept="text/csv" required />
        <br />
        <input type="file" id="Nodes" accept="text/csv" required />
        <br />
        <input type="file" id="Edges" accept="text/csv" required />
        <br />
        <input type="submit" className="add-button" onClick={handleImport}>
          Import All
        </input>
      </form>
    </div>
  );
};
