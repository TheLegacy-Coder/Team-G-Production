import React from "react";
import { MapNode, mapNodes } from "../map/MapNode.ts";
import "./styles/Csvs.css";

export const Csvs = () => {
  const rows: React.ReactElement[] = [];
  mapNodes.forEach((node: MapNode) => {
    rows.push(
      <tr>
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
    <div>
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
