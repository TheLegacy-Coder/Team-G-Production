import React from "react";

import {
  setStartNode,
  setEndNode,
  mapNodes,
  nodeStore,
  getStartNode,
  MapNode,
} from "./MapNode.ts";

import { algorithm } from "./MapAlgorithm.ts";
import { drawData, ctx } from "./DrawData.ts";

export let hoverNode: MapNode | undefined = undefined;
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
  if (drawData.scalar * zoom > 0.3 && drawData.scalar * zoom < 2) {
    //scalar *= zoom;
    drawData.setScalar(drawData.scalar * zoom);
    const scaleID = document.querySelector("#scalar");
    scaleID!.textContent = drawData.scalar.toFixed(2).toString();

    ctx!.translate(xCoord, yCoord);
    ctx!.scale(zoom, zoom);
    ctx!.translate(-xCoord, -yCoord);
  }
  drawData.updateCoords();
  boundCoords();
  //redraw = true;
  drawData.setRedraw(true);
}
export function inView(): boolean {
  return (
    drawData.pathHighest.x > drawData.upleftCorner!.x &&
    drawData.pathLowest.x < drawData.downrightCorner!.x &&
    drawData.pathHighest.y > drawData.upleftCorner!.y &&
    drawData.pathLowest.y < drawData.downrightCorner!.y
  );
}

export function buttonZoom(input: boolean) {
  let zoomIncrement: number;
  if (input) zoomIncrement = 1 + zoomAmount;
  else zoomIncrement = 1 - zoomAmount;
  zoom(zoomIncrement, drawData.centerPos!.x, drawData.centerPos!.y);
}

//Adjusts zoom according to scroll
export function mouseScroll(evt: React.WheelEvent<HTMLCanvasElement>) {
  if (tfCursor === undefined) {
    return null;
  }
  const zoomDelta = evt.deltaY < 0 ? 1 + zoomAmount : 1 - zoomAmount;
  zoom(zoomDelta, tfCursor.x, tfCursor.y);
  //redraw = true;
  drawData.setRedraw(true);
}

// runs for moving mouse
export function mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
  let moveRedraw = false;
  tfCursor = drawData.tfPoint(
    evt.pageX - drawData.offset.x,
    evt.pageY - drawData.offset.y,
  );

  if (delta === undefined || tfCursor === undefined || startPos === undefined) {
    return null;
  }

  if (moveMap) {
    const currDelta = { x: delta.x, y: delta.y };
    delta.x = evt.pageX - pageStart!.x;
    delta.y = evt.pageY - pageStart!.y;
    if (delta.x !== currDelta.x || delta.y !== currDelta.y) moveRedraw = true;
    ctx!.translate(
      tfCursor.x + drawData.offset.x / drawData.scalar - startPos.x,
      tfCursor.y + drawData.offset.y / drawData.scalar - startPos.y,
    );
  }
  mapNodes.forEach((node) => {
    if (node.floor === drawData.currentFloor) {
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
  drawData.updateCoords();
  boundCoords();
  if (moveRedraw) {
    //redraw = true;
    drawData.setRedraw(true);
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
  startPos = drawData.tfPoint(evt.pageX, evt.pageY);
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
    if (node.floor === drawData.currentFloor) {
      const dist = Math.sqrt(
        Math.pow(tfCursor!.x - node.xcoord, 2) +
          Math.pow(tfCursor!.y - node.ycoord, 2),
      );
      if (dist < 10) {
        emptyClick = false;
        if (getStartNode() != undefined) {
          setEndNode(node);
          algorithm.searchAlg();
        } else {
          drawData.resetPath();
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
    drawData.resetPath();
  }
  delta.x = 0;
  delta.y = 0;
  boundCoords();
  //redraw = true;
  drawData.setRedraw(true);
}

export function setMap(floor: string, imageSrc: string) {
  if (newMap) {
    newMap = false;
    const tempScalar = drawData.scalar;
    ctx!.save();
    drawData.resetMap();
    //currentFloor = floor;
    drawData.setCurrentFloor(floor);
    drawData.setImage(imageSrc);
    homePosition();
    newMap = true;
    ctx!.restore();
    drawData.setScalar(tempScalar);
    const scaleID = document.querySelector("#scalar");
    scaleID!.textContent = drawData.scalar.toFixed(2).toString();
    drawData.resetPath();
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
  drawData.updateCoords();
  //scalar = 0.75;
  drawData.setScalar(0.75);
  ctx!.scale(0.75, 0.75);
  drawData.updateCoords();
  boundCoords();
  const scaleID = document.querySelector("#scalar");
  scaleID!.textContent = drawData.scalar.toFixed(2).toString();
}

export function boundCoords() {
  if (
    drawData.downrightCorner === undefined ||
    drawData.upleftCorner === undefined
  )
    return null;
  if (drawData.downrightCorner.x - drawData.upleftCorner.x > imageWidth) {
    // centers canvas along x axis
    ctx!.translate(drawData.upleftCorner.x, 0);
    drawData.updateCoords();
    ctx!.translate(
      (drawData.downrightCorner.x -
        imageWidth -
        drawData.offset.x / drawData.scalar) /
        2,
      0,
    );
  } else {
    if (drawData.upleftCorner.x < 0) {
      // aligns canvas along left side
      ctx!.translate(drawData.upleftCorner.x, 0);
    } else if (
      drawData.downrightCorner.x >
      imageWidth + drawData.offset.x / drawData.scalar
    ) {
      // aligns canvas along right side
      ctx!.translate(
        -imageWidth -
          drawData.offset.x / drawData.scalar +
          drawData.downrightCorner.x,
        0,
      );
    }
  }
  if (drawData.downrightCorner.y - drawData.upleftCorner.y > imageHeight) {
    // centers canvas along y axis
    ctx!.translate(0, drawData.upleftCorner.y);
    drawData.updateCoords();
    ctx!.translate(
      0,
      (drawData.downrightCorner.y -
        imageHeight -
        drawData.offset.y / drawData.scalar) /
        2,
    );
  } else {
    if (drawData.upleftCorner.y < 0) {
      // aligns canvas along top side
      ctx!.translate(0, drawData.upleftCorner.y);
    } else if (
      drawData.downrightCorner.y >
      imageHeight + drawData.offset.y / drawData.scalar
    ) {
      // aligns canvas along bottom side
      ctx!.translate(
        0,
        -imageHeight -
          drawData.offset.y / drawData.scalar +
          drawData.downrightCorner.y,
      );
    }
  }
  drawData.updateCoords();
}
