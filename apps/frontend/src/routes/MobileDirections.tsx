import React, { useReducer } from "react";
import {
  AStarSearch,
  BreadthFirstSearch,
  DepthFirstSearch,
  getEndNode,
  getStartNode,
  mapEdges,
  MapNode,
  mapNodes,
  setEndNode,
  setStartNode,
} from "../map/MapNode.ts";
import { algorithm } from "../map/MapAlgorithm.ts";
import { drawData } from "../map/DrawData.ts";
import "./styles/MobileDirections.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export const MobileDirections = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const start = params.get("start");
  const end = params.get("end");
  const alg = params.get("alg");
  let path: MapNode[] = [];
  let directions: string[] = [];
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

    if (drawData.getSwitchNodes().includes(currentNode)) {
      const switchFloor =
        drawData.getSwitchFloors()[
          drawData.getSwitchNodes().indexOf(currentNode)
        ];
      return `Go to Floor ${switchFloor}`;
    } else if (angleDeg > 20) {
      return "Turn right";
    } else if (angleDeg < -20) {
      return "Turn left";
    } else {
      return "Continue straight";
    }
  };

  if (
    mapNodes !== undefined &&
    mapEdges !== undefined &&
    mapEdges.size > 0 &&
    mapNodes.size > 0
  ) {
    if (start !== null && end !== null && alg !== null) {
      setStartNode(mapNodes.get(start));
      setEndNode(mapNodes.get(end));
      if (alg === "BFS") {
        algorithm.setSearchStrategy(new BreadthFirstSearch());
      } else if (alg === "A*") {
        algorithm.setSearchStrategy(new AStarSearch());
      } else if (alg === "DFS") {
        algorithm.setSearchStrategy(new DepthFirstSearch());
      }
      algorithm.nodePoll();

      if (getStartNode() && getEndNode()) {
        path = drawData.unfilteredPath.slice().reverse();
        console.log(drawData.unfilteredPath);
      }

      directions = path.map((mapNode: MapNode, index: number) => {
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

          if (drawData.allSwitchNodes.includes(mapNode)) {
            const switchFloor =
              drawData.allSwitchFloors[
                drawData.allSwitchNodes.indexOf(mapNode)
              ];
            if (switchFloor === mapNode.floor) {
              return `Exit ${mapNode.longName} onto floor ${switchFloor}`;
            } else {
              return `Go to Floor ${switchFloor} from ${mapNode.longName}`;
            }
          } else if (mapNode.nodeType === "HALL" && angleDeg !== 0) {
            return `${getTurnDirection(prevNode, mapNode, nextNode)} at ${mapNode.shortName}`;
          } else if (mapNode.nodeType !== "HALL") {
            return `${getTurnDirection(prevNode, mapNode, nextNode)} at ${mapNode.shortName}`;
          } else {
            return "";
          }
        }
      });
    }
  } else {
    setTimeout(forceUpdate, 100);
  }

  return (
    <div>
      <div className={"directions-container"}>
        <div className={"directions-container-inner"}>
          <Swiper
            pagination={{
              type: "progressbar",
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {directions.map((direction) =>
              direction === "" ? (
                <></>
              ) : (
                <SwiperSlide>
                  <div className={"card-div"}>
                    <h1>{direction}</h1>
                  </div>
                </SwiperSlide>
              ),
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
