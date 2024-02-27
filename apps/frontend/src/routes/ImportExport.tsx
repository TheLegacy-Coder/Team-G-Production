import "./styles/ImportExport.css";
import { Employee } from "common/src/Employee.ts";
import { getEmployeesAxios } from "../DataAsObject/employeesAxios.ts";
import { EmployeeWrapper } from "./ViewEmployees.tsx";
import { useEffect, useState } from "react";
import { Edge, mapEdges, MapNode, mapNodes } from "../map/MapNode.ts";
import React from "react";
import * as JSZip from "jszip";
import { saveAs } from "file-saver";
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

  const handleExport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let rows: string[] = [];
    let csvArray;

    const zip = new JSZip();
    if (
      (document.getElementById("EmployeesCheck") as HTMLInputElement).checked
    ) {
      rows.push("employeeID,firstName,lastName,email,job,accessLevel");
      employees.forEach((row: Employee) => {
        rows.push(Object.values(row).slice(0, 6).join(","));
      });
      csvArray = rows.join("\r\n");
      zip.file("employees.csv", csvArray);
    }

    if ((document.getElementById("NodesCheck") as HTMLInputElement).checked) {
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
      zip.file("nodes.csv", csvArray);
    }

    if ((document.getElementById("EdgesCheck") as HTMLInputElement).checked) {
      rows = [];
      rows.push("edgeID,startNode,endNode");
      mapEdges.forEach((row: Edge) => {
        rows.push(Object.values(row).slice(0, 3).join(","));
      });
      csvArray = rows.join("\r\n");
      zip.file("edges.csv", csvArray);
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "data.zip");
    });
  };

  const handleImport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const employeeFile = formData.get("Employees") as File;
    const nodeFile = formData.get("Nodes") as File;
    const edgeFile = formData.get("Edges") as File;

    console.log(formData.get("Employees"));

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
      console.log(importedMapNodes);
    };
    reader.readAsText(nodeFile);

    (document.getElementById("Employees") as HTMLInputElement).value = "";
    (document.getElementById("Nodes") as HTMLInputElement).value = "";
    (document.getElementById("Edges") as HTMLInputElement).value = "";
  };

  return (
    <div className={"data-page"}>
      <div className={"panel"}>
        <h2>Export</h2>
        <form onSubmit={handleExport}>
          <div className={"checkboxes"}>
            <div className={"export-option"}>
              <input id="EmployeesCheck" type="checkbox" />
              <label>Employees</label>
            </div>
            <div className={"export-option"}>
              <input id="NodesCheck" type="checkbox" />
              <label>Nodes</label>
            </div>
            <div className={"export-option"}>
              <input id="EdgesCheck" type="checkbox" />
              <label>Edges</label>
            </div>
          </div>
          <input value="Export" type="submit" className="add-button" />
        </form>
      </div>
      <div className={"panel"}>
        <h2>Import</h2>
        <form id="fileUploads" onSubmit={handleImport}>
          <div className={"import-option"}>
            <label>Employees</label>
            <input
              name="Employees"
              type="file"
              id="Employees"
              accept="text/csv"
              required
            />
          </div>
          <div className={"import-option"}>
            <label>Nodes</label>
            <input
              name="Nodes"
              type="file"
              id="Nodes"
              accept="text/csv"
              required
            />
          </div>
          <div className={"import-option"}>
            <label>Edges</label>
            <input
              name="Edges"
              type="file"
              id="Edges"
              accept="text/csv"
              required
            />
          </div>
          <input value="Import" type="submit" className="add-button" />
        </form>
      </div>
    </div>
  );
};
