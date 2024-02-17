/**
 * Completed
 */

import { AStarSearch, getEndNode, getStartNode, MapNode } from "./MapNode.ts";

/**
 * NOT Completed
 */

import {
  /*floors,
  pathLowest,
  pathHighest,
  currentFloor,
  clearFloors,
  path,
  resetPath,
  framePush,
  setRedraw,*/
  drawData,
} from "./DrawData.ts";

let startNode: MapNode | undefined = undefined;
let endNode: MapNode | undefined = undefined;

const imageWidth = 5000;
const imageHeight = 3400;

const spacing = 50;
let totalDistance = 0;
let steps: number[] = [];

/*export let floors: string[] = [];
export let pathLowest = { x: 0, y: 0 };
export let pathHighest = { x: 0, y: 0 };*/

function setFloorButtons() {
  for (let i = 0; i < drawData.floors.length; i++) {
    if (drawData.floors[i].length === 1)
      drawData.floors[i] = "F" + drawData.floors[i];
    const scaleID = document.querySelector("#" + drawData.floors[i]);
    scaleID!.classList.add("path-floor");
  }
}

export function searchAlg() {
  // filters path not on floor
  const unfilteredPath = AStarSearch(startNode, endNode);

  //floors = [];
  drawData.clearFloors();

  drawData.pathLowest.x = imageWidth;
  drawData.pathLowest.y = imageHeight;
  drawData.pathHighest.x = imageWidth;
  drawData.pathHighest.y = imageHeight;

  unfilteredPath.forEach((node) => {
    if (node.floor === drawData.currentFloor) drawData.path.push(node);
    if (!drawData.floors.includes(node.floor)) drawData.floors.push(node.floor);
  });

  setFloorButtons();

  totalDistance = 0;
  steps = [0];
  let last: MapNode | undefined = undefined;
  // gets distance based on connected nodes
  drawData.path.forEach((node) => {
    if (last != undefined /* && node.edges.includes(last)*/) {
      const length = Math.sqrt(
        Math.pow(last.ycoord - node.ycoord, 2) +
          Math.pow(last.xcoord - node.xcoord, 2),
      );
      totalDistance += length;
      steps.push(totalDistance);
    }
    last = node;
  });
  //bake frames
  for (let f = 0; f < spacing; f++) {
    const temp: number[][] = [];
    for (let i = 0; i < totalDistance / spacing; i++) {
      let prog = spacing * i + (f % spacing);
      let s = 0;
      while (s < drawData.path.length) {
        if (prog < steps[s]) {
          break;
        }
        s++;
      }
      s--;
      prog -= steps[s];
      if (
        s + 1 < drawData.path.length &&
        drawData.path[s + 1].edges.includes(drawData.path[s])
      ) {
        const angleRadians = Math.atan2(
          drawData.path[s].ycoord - drawData.path[s + 1].ycoord,
          drawData.path[s].xcoord - drawData.path[s + 1].xcoord,
        );
        const x = drawData.path[s].xcoord - Math.cos(angleRadians) * prog;
        const y = drawData.path[s].ycoord - Math.sin(angleRadians) * prog;
        temp.push([x, y]);
        if (x < drawData.pathLowest.x) drawData.pathLowest.x = x;
        else if (x > drawData.pathHighest.x) drawData.pathHighest.x = x;
        if (y < drawData.pathLowest.y) drawData.pathLowest.y = y;
        else if (y > drawData.pathHighest.y) drawData.pathHighest.y = y;
      }
    }
    //frames.push(temp);
    drawData.framePush(temp);
  }
  //redraw = true;
  drawData.setRedraw(true);
}

export function nodePoll() {
  const prevStart = startNode;
  const prevEnd = endNode;
  startNode = getStartNode();
  endNode = getEndNode();
  if (prevStart !== startNode || prevEnd !== endNode) {
    const floorNames: string[] = ["F3", "F2", "F1", "L1", "L2"];
    for (let i = 0; i < floorNames.length; i++) {
      const scaleID = document.querySelector("#" + floorNames[i]);
      if (scaleID !== null) scaleID!.classList.remove("path-floor");
    }
    //floors = [];
    drawData.clearFloors();
    drawData.path.forEach((node) => {
      if (!drawData.floors.includes(node.floor))
        drawData.floors.push(node.floor);
    });
    setFloorButtons();
  }

  if (
    startNode !== undefined &&
    endNode !== undefined &&
    (prevStart !== startNode || prevEnd !== endNode)
  ) {
    drawData.resetPath();
    searchAlg();
  }
}
