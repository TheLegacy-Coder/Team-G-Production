import React from "react";
import { MapNode, mapNodes } from "../map/MapNode.ts";
import "./styles/Csvs.css";

export const Csvs = () => {
  const handleExportNodes = () => {
    console.log("Exporting nodes");
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
    <div className={"csvs-page"}>
      <h1>Nodes</h1>
      <button onClick={handleExportNodes}>Export CSV</button>
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
    </div>
  );
};
