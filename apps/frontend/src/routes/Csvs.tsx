import React from "react";
import { MapNode, mapNodes } from "../map/MapNode.ts";

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
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
