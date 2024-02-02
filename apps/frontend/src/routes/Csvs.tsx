import React, { useReducer } from "react";
import {
  Edge,
  getMapNodesEdges,
  mapEdges,
  MapNode,
  mapNodes,
} from "../map/MapNode.ts";
import "./styles/Csvs.css";
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const Nodes = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleExportNodes = () => {
    const rows: string[] = [];
    rows.push(
      "nodeID,xcoord,ycoord,floor,building,nodeType,longName,shortName",
    );
    mapNodes.forEach((row: MapNode) => {
      rows.push(Object.values(row).slice(0, 8).join(","));
    });
    const csvArray = rows.join("\r\n");
    const a = document.createElement("a");
    a.href = "data:attachment/csv," + encodeURIComponent(csvArray);
    a.target = "_blank";
    a.download = "nodes.csv";
    document.body.appendChild(a);
    a.click();
  };

  const handleImportNodes = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const file = e.target.files[0];
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
      }

      axios
        .post("http://localhost:3000/api/map/nodes", {
          deleteAll: true,
          nodes: importedMapNodes,
        })
        // update local store
        .then(() => {
          getMapNodesEdges().then(() => {
            forceUpdate();
          });
        });
    };
    reader.readAsText(file);

    // post all new nodes & replace all old ones
  };

  const rows: React.ReactElement[] = [];
  mapNodes.forEach((node: MapNode) => {
    rows.push(
      <tr key={node.nodeID}>
        <td>{node.nodeID}</td>
        <td>{node.xcoord}</td>
        <td>{node.ycoord}</td>
        <td>{node.floor}</td>
        <td>{node.building}</td>
        <td>{node.nodeType}</td>
        <td>{node.longName}</td>
        <td>{node.shortName}</td>
      </tr>,
    );
  });

  return (
    <>
      <h1>Nodes</h1>
      <button onClick={handleExportNodes}>Export CSV</button>
      <label style={{ border: "2px solid" }}>
        <input
          onChange={handleImportNodes}
          type={"file"}
          accept={".csv"}
          hidden
        />
        Import CSV
      </label>
      <table>
        <thead>
          <tr>
            <th>nodeID</th>
            <th>xcoord</th>
            <th>ycoord</th>
            <th>floor</th>
            <th>building</th>
            <th>nodeType</th>
            <th>longName</th>
            <th>shortName</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

const Edges = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleExportEdges = () => {
    const rows: string[] = [];
    rows.push("edgeID,startNode,endNode");
    mapEdges.forEach((row: Edge) => {
      rows.push(Object.values(row).slice(0, 3).join(","));
    });
    const csvArray = rows.join("\r\n");
    const a = document.createElement("a");
    a.href = "data:attachment/csv," + encodeURIComponent(csvArray);
    a.target = "_blank";
    a.download = "edges.csv";
    document.body.appendChild(a);
    a.click();
  };

  const handleImportEdges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const importedMapEdges: Edge[] = [];
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
          const edge: Edge = {
            edgeID: line[0],
            startNode: line[1],
            endNode: line[2],
          };
          importedMapEdges.push(edge);
        }
      }
      axios
        .post("http://localhost:3000/api/map/edges", {
          deleteAll: true,
          edges: importedMapEdges,
        })
        // update local store
        .then(() => {
          getMapNodesEdges().then(() => {
            forceUpdate();
          });
        });
    };
    reader.readAsText(file);

    // post all new nodes & replace all old ones
  };

  const rows: React.ReactElement[] = [];
  mapEdges.forEach((edge: Edge) => {
    rows.push(
      <tr key={edge.edgeID}>
        <td>{edge.edgeID}</td>
        <td>{edge.startNode}</td>
        <td>{edge.endNode}</td>
      </tr>,
    );
  });

  return (
    <>
      <h1>Edges</h1>
      <button onClick={handleExportEdges}>Export CSV</button>
      <label style={{ border: "2px solid" }}>
        <input
          onChange={handleImportEdges}
          type={"file"}
          accept={".csv"}
          hidden
        />
        Import CSV
      </label>
      <table>
        <thead>
          <tr>
            <th>edgeID</th>
            <th>startNode</th>
            <th>endNode</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

export const Csvs = () => {
  return (
    <div className={"csvs-page"}>
      <Tabs
        defaultActiveKey="nodes"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="nodes" title="Nodes">
          <Nodes />
        </Tab>
        <Tab eventKey="edges" title="Edges">
          <Edges />
        </Tab>
      </Tabs>
    </div>
  );
};
