import React, { useEffect, useState } from "react";
import {
  getStartNode,
  getEndNode,
  AStarSearch,
  MapNode,
} from "../map/MapNode.ts";

const TextDirections: React.FC = () => {
  const [path, setPath] = useState<MapNode[]>([]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      const startNode = getStartNode();
      const endNode = getEndNode();

      const newPath = AStarSearch(startNode, endNode);
      setPath(newPath.reverse());
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

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
    const angleDeg = (angle * 180) / Math.PI;

    if (angleDeg > 0) {
      return "Turn right";
    } else if (angleDeg < 0) {
      return "Turn left";
    }
  };

  const directions = path.map((mapNode: MapNode, index: number) => {
    if (index === 0) {
      return `Start at ${mapNode.shortName}`;
    } else if (index === path.length - 1) {
      return `End at ${mapNode.shortName}`;
    } else {
      const prevNode = path[index - 1];
      const nextNode = path[index + 1];
      return `${getTurnDirection(prevNode, mapNode, nextNode)} at ${mapNode.shortName}`;
    }
  });

  return (
    <div className={"container-div"}>
      <div className={"asdf2-text-directions-container"}>
        {directions.map((direction, index) => (
          <p key={index}>{direction}</p>
        ))}
      </div>
    </div>
  );
};

export default TextDirections;
