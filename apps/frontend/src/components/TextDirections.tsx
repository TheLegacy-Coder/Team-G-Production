import React from "react";
import { MapNode } from "../map/MapNode.ts";
import "./styles/TextDirections.css";
import { drawData } from "../map/DrawData.ts";

const TextDirections: React.FC = () => {
  const path = drawData.path.slice().reverse();

  const getTurnDirection = (
    prevNode: MapNode,
    currentNode: MapNode,
    nextNode: MapNode,
  ) => {
    const angle =
      Math.atan2(
        nextNode.ycoord - currentNode.ycoord,
        nextNode.xcoord - currentNode.xcoord,
      ) -
      Math.atan2(
        currentNode.ycoord - prevNode.ycoord,
        currentNode.xcoord - prevNode.xcoord,
      );
    let angleDeg = (angle * 180) / Math.PI;

    if (angleDeg < -180) angleDeg += 360;
    if (angleDeg > 180) angleDeg -= 360;

    if (angleDeg > 20) {
      return "Turn right";
    } else if (angleDeg < -20) {
      return "Turn left";
    } else {
      return "Continue straight";
    }
  };

  const directions = path.map((mapNode: MapNode, index: number) => {
    if (index === 0) {
      return `Start at ${mapNode.longName}`;
    } else if (index === path.length - 1) {
      return `End at ${mapNode.longName}`;
    } else {
      const prevNode = path[index - 1];
      const nextNode = path[index + 1];
      const angle =
        Math.atan2(
          nextNode.ycoord - mapNode.ycoord,
          nextNode.xcoord - mapNode.xcoord,
        ) -
        Math.atan2(
          mapNode.ycoord - prevNode.ycoord,
          mapNode.xcoord - prevNode.xcoord,
        );
      let angleDeg = (angle * 180) / Math.PI;

      if (angleDeg < -180) angleDeg += 360;
      if (angleDeg > 180) angleDeg -= 360;

      if (mapNode.nodeType === "HALL" && angleDeg !== 0) {
        return `${getTurnDirection(prevNode, mapNode, nextNode)} at ${mapNode.shortName}`;
      } else if (mapNode.nodeType !== "HALL") {
        return `${getTurnDirection(prevNode, mapNode, nextNode)} at ${mapNode.shortName}`;
      } else {
        return "";
      }
    }
  });

  return (
    <div className={"container-div"}>
      <div
        className={"asdf2-text-directions-container"}
        style={{ maxHeight: "450px" }}
      >
        {directions.map((direction, index) => (
          <p key={index}>{direction} </p>
        ))}
      </div>
    </div>
  );
};

export default TextDirections;
