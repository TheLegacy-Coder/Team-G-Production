import React from "react";

/**
 * Completed
 */
import {
  setStartNode,
  setEndNode,
  mapNodes,
  nodeStore,
  getStartNode,
  MapNode,
} from "./MapNode.ts";

/**
 * NOT Completed
 */

import { searchAlg } from "./MapAlgorithm.ts";
import {
  pathLowest,
  pathHighest,
  currentFloor,
  setCurrentFloor,
  resetPath,
  setRedraw,
  scalar,
  setScalar,
  offset,
  setImage,
  ctx,
  resetMap,
  upleftCorner,
  updateCoords,
  downrightCorner,
  centerPos,
  tfPoint,
} from "./DrawData.ts";

/**
 * Start Exported types
 */

export let hoverNode: MapNode | undefined = undefined;

/**
 * End Exported types
 */

const imageWidth = 5000;
const imageHeight = 3400;

//Stores map delta xy coordinates while panning
const delta: { x: number; y: number } | undefined = { x: 0, y: 0 };
//Stores the start xy of mouse when pressed to test click clear or not
const pageStart: { x: number; y: number } | undefined = { x: 0, y: 0 };
//Stores whether to update map position if moving
let moveMap = false;
// start position in image frame for translating when panning
let startPos: { x: number; y: number } | undefined = { x: 0, y: 0 };
// coordinates of mouse in map frame
let tfCursor: { x: number; y: number } | undefined = { x: 0, y: 0 };

const zoomAmount = 0.1;

let newMap = true;

// zooms to a point
function zoom(zoom: number, xCoord: number, yCoord: number) {
  if (scalar * zoom > 0.3 && scalar * zoom < 2) {
    //scalar *= zoom;
    setScalar(scalar * zoom);
    const scaleID = document.querySelector("#scalar");
    scaleID!.textContent = scalar.toFixed(2).toString();

    ctx!.translate(xCoord, yCoord);
    ctx!.scale(zoom, zoom);
    ctx!.translate(-xCoord, -yCoord);
  }
  updateCoords();
  boundCoords();
  //redraw = true;
  setRedraw(true);
}

export function inView(): boolean {
  return (
    pathHighest.x > upleftCorner!.x &&
    pathLowest.x < downrightCorner!.x &&
    pathHighest.y > upleftCorner!.y &&
    pathLowest.y < downrightCorner!.y
  );
}

export function buttonZoom(input: boolean) {
  let zoomIncrement: number;
  if (input) zoomIncrement = 1 + zoomAmount;
  else zoomIncrement = 1 - zoomAmount;
  zoom(zoomIncrement, centerPos!.x, centerPos!.y);
}

//Adjusts zoom according to scroll
export function mouseScroll(evt: React.WheelEvent<HTMLCanvasElement>) {
  if (tfCursor === undefined) {
    return null;
  }
  const zoomDelta = evt.deltaY < 0 ? 1 + zoomAmount : 1 - zoomAmount;
  zoom(zoomDelta, tfCursor.x, tfCursor.y);
  //redraw = true;
  setRedraw(true);
}

// runs for moving mouse
export function mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
  let moveRedraw = false;
  tfCursor = tfPoint(evt.pageX - offset.x, evt.pageY - offset.y);

  if (delta === undefined || tfCursor === undefined || startPos === undefined) {
    return null;
  }

  if (moveMap) {
    const currDelta = { x: delta.x, y: delta.y };
    delta.x = evt.pageX - pageStart!.x;
    delta.y = evt.pageY - pageStart!.y;
    if (delta.x !== currDelta.x || delta.y !== currDelta.y) moveRedraw = true;
    ctx!.translate(
      tfCursor.x + offset.x / scalar - startPos.x,
      tfCursor.y + offset.y / scalar - startPos.y,
    );
  }
  mapNodes.forEach((node) => {
    if (node.floor === currentFloor) {
      const dist = Math.sqrt(
        Math.pow(tfCursor!.x - node.xcoord, 2) +
          Math.pow(tfCursor!.y - node.ycoord, 2),
      );
      if (dist < 10) {
        if (hoverNode !== node) {
          moveRedraw = true;
        }
        hoverNode = node;
      } else if (hoverNode == node) {
        hoverNode = undefined;
        moveRedraw = true;
      }
    }
  });
  updateCoords();
  boundCoords();
  if (moveRedraw) {
    //redraw = true;
    setRedraw(true);
  }
}

//Starts moving map according to mouse drag
export function mouseDown(evt: React.MouseEvent<Element, MouseEvent>) {
  if (pageStart === undefined) {
    return null;
  }
  pageStart.x = evt.pageX;
  pageStart.y = evt.pageY;
  moveMap = true;
  startPos = tfPoint(evt.pageX, evt.pageY);
  boundCoords();
}

// runs when mouse released
export function mouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
  if (tfCursor === undefined || delta === undefined) {
    return null;
  }
  moveMap = false;
  evt.pageX;
  let emptyClick = true;
  mapNodes.forEach((node) => {
    if (node.floor === currentFloor) {
      const dist = Math.sqrt(
        Math.pow(tfCursor!.x - node.xcoord, 2) +
          Math.pow(tfCursor!.y - node.ycoord, 2),
      );
      if (dist < 10) {
        emptyClick = false;
        if (getStartNode() != undefined) {
          setEndNode(node);
          searchAlg();
        } else {
          resetPath();
          setStartNode(node);
        }
        nodeStore.setSelectedNode(node);
      }
    }
  });
  if (emptyClick && delta.x == 0 && delta.y == 0) {
    setStartNode(undefined);
    setEndNode(undefined);
    nodeStore.setSelectedNode(undefined);
    resetPath();
  }
  delta.x = 0;
  delta.y = 0;
  boundCoords();
  //redraw = true;
  setRedraw(true);
}

export function setMap(floor: string, imageSrc: string) {
  if (newMap) {
    newMap = false;
    const tempScalar = scalar;
    ctx!.save();
    resetMap();
    //currentFloor = floor;
    setCurrentFloor(floor);
    setImage(imageSrc);
    homePosition();
    newMap = true;
    ctx!.restore();
    setScalar(tempScalar);
    const scaleID = document.querySelector("#scalar");
    scaleID!.textContent = scalar.toFixed(2).toString();
    resetPath();
    return true;
  }
  return false;
}

// resets map position to a default position
export function homePosition() {
  if (ctx === null) {
    return;
  }
  ctx!.translate(-1200, -400);
  updateCoords();
  //scalar = 0.75;
  setScalar(0.75);
  ctx!.scale(0.75, 0.75);
  updateCoords();
  boundCoords();
  const scaleID = document.querySelector("#scalar");
  scaleID!.textContent = scalar.toFixed(2).toString();
}

export function boundCoords() {
  if (downrightCorner === undefined || upleftCorner === undefined) return null;
  if (downrightCorner.x - upleftCorner.x > imageWidth) {
    // centers canvas along x axis
    ctx!.translate(upleftCorner.x, 0);
    updateCoords();
    ctx!.translate((downrightCorner.x - imageWidth - offset.x / scalar) / 2, 0);
  } else {
    if (upleftCorner.x < 0) {
      // aligns canvas along left side
      ctx!.translate(upleftCorner.x, 0);
    } else if (downrightCorner.x > imageWidth + offset.x / scalar) {
      // aligns canvas along right side
      ctx!.translate(-imageWidth - offset.x / scalar + downrightCorner.x, 0);
    }
  }
  if (downrightCorner.y - upleftCorner.y > imageHeight) {
    // centers canvas along y axis
    ctx!.translate(0, upleftCorner.y);
    updateCoords();
    ctx!.translate(
      0,
      (downrightCorner.y - imageHeight - offset.y / scalar) / 2,
    );
  } else {
    if (upleftCorner.y < 0) {
      // aligns canvas along top side
      ctx!.translate(0, upleftCorner.y);
    } else if (downrightCorner.y > imageHeight + offset.y / scalar) {
      // aligns canvas along bottom side
      ctx!.translate(0, -imageHeight - offset.y / scalar + downrightCorner.y);
    }
  }
  updateCoords();
}
