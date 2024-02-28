import "./styles/ImportExport.css";
import { Employee } from "common/src/Employee.ts";
import {
  addMultipleEmployeesAxios,
  getEmployeesAxios,
} from "../DataAsObject/employeesAxios.ts";
import { EmployeeWrapper } from "./ViewEmployees.tsx";
import { useEffect, useReducer, useState } from "react";
import {
  Edge,
  getMapNodesEdges,
  mapEdges,
  MapNode,
  mapNodes,
} from "../map/MapNode.ts";
import React from "react";
import {
  postEdgesAxios,
  postNodesAxios,
} from "../DataAsObject/mapNodesAxios.ts";
async function getEmployees(): Promise<EmployeeWrapper> {
  return getEmployeesAxios("true", "");
}

export const ImportExport = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

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

    if (
      (document.getElementById("EmployeesCheck") as HTMLInputElement).checked
    ) {
      rows.push("employeeID,firstName,lastName,email,job,accessLevel");
      employees.forEach((row: Employee) => {
        rows.push(Object.values(row).slice(0, 6).join(","));
      });
      csvArray = rows.join("\r\n");
      const a = document.createElement("a");
      a.href = "data:attachment/csv," + encodeURIComponent(csvArray);
      a.target = "_blank";
      a.download = "employees.csv";
      document.body.appendChild(a);
      a.click();
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
      const a = document.createElement("a");
      a.href = "data:attachment/csv," + encodeURIComponent(csvArray);
      a.target = "_blank";
      a.download = "nodes.csv";
      document.body.appendChild(a);
      a.click();
    }

    if ((document.getElementById("EdgesCheck") as HTMLInputElement).checked) {
      rows = [];
      rows.push("edgeID,startNode,endNode");
      mapEdges.forEach((row: Edge) => {
        rows.push(Object.values(row).slice(0, 3).join(","));
      });
      csvArray = rows.join("\r\n");
      const a = document.createElement("a");
      a.href = "data:attachment/csv," + encodeURIComponent(csvArray);
      a.target = "_blank";
      a.download = "edges.csv";
      document.body.appendChild(a);
      a.click();
    }
  };

  const handleImport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const employeeFile = formData.get("Employees") as File;
    const nodeFile = formData.get("Nodes") as File;
    const edgeFile = formData.get("Edges") as File;

    // upload employees
    if (employeeFile.size !== 0) {
      const importedMapEmployees: Employee[] = [];
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
          console.log(importedMapEmployees);
          // post all new employees & replace all old ones
          addMultipleEmployeesAxios("true", importedMapEmployees).then(() => {
            // update local store
            getAndSetEmployees();
          });
        }
      };
      reader.readAsText(employeeFile);
    }

    const uploadEdges = (edgeFile: File) => {
      if (edgeFile.size !== 0) {
        const importedMapEdges: Edge[] = [];
        const reader = new FileReader();
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
            console.log(importedMapEdges);
            postEdgesAxios("true", importedMapEdges).then(() => {
              getMapNodesEdges().then(() => {
                forceUpdate();
              });
            });
          }
        };
        reader.readAsText(edgeFile);
      }
    };

    if (nodeFile.size !== 0) {
      // if nodes are being uploaded, upload nodes then edges so edges can reference nodes
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
      const reader = new FileReader();
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
          console.log(importedMapNodes);
          postNodesAxios("true", importedMapNodes).then(() => {
            getMapNodesEdges().then(() => {
              forceUpdate();
              uploadEdges(edgeFile);
            });
          });
        }
      };
      reader.readAsText(nodeFile);
    } else {
      // if nodes are not being uploaded, just upload edges
      uploadEdges(edgeFile);
    }

    // clear the file inputs
    (document.getElementById("Employees") as HTMLInputElement).value = "";
    (document.getElementById("Nodes") as HTMLInputElement).value = "";
    (document.getElementById("Edges") as HTMLInputElement).value = "";
  };

  const handleSelectAll = () => {
    (document.getElementById("EmployeesCheck") as HTMLInputElement).checked =
      true;
    (document.getElementById("NodesCheck") as HTMLInputElement).checked = true;
    (document.getElementById("EdgesCheck") as HTMLInputElement).checked = true;
  };

  const handleUnselectAll = () => {
    (document.getElementById("EmployeesCheck") as HTMLInputElement).checked =
      false;
    (document.getElementById("NodesCheck") as HTMLInputElement).checked = false;
    (document.getElementById("EdgesCheck") as HTMLInputElement).checked = false;
  };

  return (
    <div className={"data-page"}>
      <div className={"panel"}>
        <h2>Export</h2>
        <form onSubmit={handleExport}>
          <div className={"checkboxes"}>
            <div className={"export-option"}>
              <input
                id="EmployeesCheck"
                type="checkbox"
                className={"file-checkbox"}
                defaultChecked={true}
              />
              <label>Employees</label>
            </div>
            <div className={"export-option"}>
              <input
                id="NodesCheck"
                type="checkbox"
                className={"file-checkbox"}
                defaultChecked={true}
              />
              <label>Nodes</label>
            </div>
            <div className={"export-option"}>
              <input
                id="EdgesCheck"
                type="checkbox"
                className={"file-checkbox"}
                defaultChecked={true}
              />
              <label>Edges</label>
            </div>
          </div>
          <div className={"select-buttons"}>
            <button
              className={"select-button"}
              type="button"
              onClick={handleSelectAll}
            >
              Select All
            </button>
            <button
              className={"select-button"}
              type="button"
              onClick={handleUnselectAll}
            >
              Unselect All
            </button>
          </div>
          <input value="Export" type="submit" className="file-submit" />
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
              className={"file-input"}
            />
          </div>
          <div className={"import-option"}>
            <label>Nodes</label>
            <input
              name="Nodes"
              type="file"
              id="Nodes"
              accept="text/csv"
              className={"file-input"}
            />
          </div>
          <div className={"import-option"}>
            <label>Edges</label>
            <input
              name="Edges"
              type="file"
              id="Edges"
              accept="text/csv"
              className={"file-input"}
            />
          </div>
          <input value="Import" type="submit" className="file-submit" />
        </form>
      </div>
    </div>
  );
};
