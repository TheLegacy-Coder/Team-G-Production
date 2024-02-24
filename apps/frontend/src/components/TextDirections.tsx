import React from "react";
import { getEndNode, getStartNode, MapNode } from "../map/MapNode.ts";
import "./styles/TextDirections.css";
import { drawData } from "../map/DrawData.ts";
import {
  ArrowUpCircleFill,
  GeoAlt,
  GeoAltFill,
  SignTurnLeftFill,
  SignTurnRightFill,
  ArrowDownUp,
  PersonWalking,
} from "react-bootstrap-icons";

const TextDirections: React.FC = () => {
  let path: MapNode[] = [];

  if (getStartNode() && getEndNode()) {
    path = drawData.unfilteredPath.slice().reverse();
  }

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
      return (
        <>
          <SignTurnRightFill size={35} />
          <p>Turn right at {currentNode.shortName}</p>
        </>
      );
    } else if (angleDeg < -20) {
      return (
        <>
          <SignTurnLeftFill size={35} />
          <p>Turn left at {currentNode.shortName}</p>
        </>
      );
    } else {
      return (
        <>
          <ArrowUpCircleFill size={35} />
          Continue straight
        </>
      );
    }
  };

  const directions = path.map((mapNode: MapNode, index: number) => {
    let contents;
    if (index === 0) {
      contents = (
        <>
          <GeoAlt size={35} />
          <p key={index}>Start at {mapNode.longName}</p>
        </>
      );
    } else if (index === path.length - 1) {
      contents = (
        <>
          <GeoAltFill size={35} />
          <p key={index}>End at {mapNode.longName}</p>
        </>
      );
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

      if (drawData.allSwitchNodes.includes(mapNode)) {
        const switchFloor =
          drawData.allSwitchFloors[drawData.allSwitchNodes.indexOf(mapNode)];
        if (switchFloor === mapNode.floor) {
          contents = (
            <>
              <PersonWalking size={35} />
              <p key={index}>
                Exit {mapNode.longName} onto floor {switchFloor}
              </p>
            </>
          );
        } else {
          contents = (
            <>
              <ArrowDownUp size={35} />
              <p key={index}>
                Go to Floor {switchFloor} from {mapNode.longName}
              </p>
            </>
          );
        }
      } else if (mapNode.nodeType === "HALL" && angleDeg !== 0) {
        contents = getTurnDirection(prevNode, mapNode, nextNode);
      }
    }
    if (contents) {
      return (
        <div key={index} className="directionDiv">
          {contents}
        </div>
      );
    }
    return;
  });

  return (
    <div className={"container-div"}>
      <div
        className={"asdf2-text-directions-container"}
        style={{ maxHeight: "450px" }}
      >
        {directions}
      </div>
    </div>
  );
};

export default TextDirections;
