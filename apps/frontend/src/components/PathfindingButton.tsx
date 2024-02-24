import React from "react";
import "./styles/PathfindingButton.css";

interface PathfindingProps {
  algorithm: string;
  handleChange: (newAlg: string) => void;
}
export const PathfindingButton = ({
  algorithm,
  handleChange,
}: PathfindingProps) => {
  return (
    <select
      name="pathfindingButton"
      className="pathfindingButton"
      id="pathfindingButton"
      value={algorithm}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="BFS">BFS</option>
      <option value="A*">A*</option>
      <option value="DFS">DFS</option>
      <option value="Dijkstra">Dijkstra</option>
    </select>
  );
};
