import React from "react";
import { setStartNode, setEndNode, mapNodes, nodeStore } from "./MapNode.ts";
import {
  scalar,
  ctx,
  setScalar,
  updateCoords,
  boundCoords,
  zoomAmount,
  setRedraw,
  tfPoint,
  offset,
  currentFloor,
  hoverNode,
  setHover,
  resetPath,
  startNode,
  path,
  searchAlg,
} from "./Draw.ts";

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

// zooms to a point
export function zoom(zoom: number, xCoord: number, yCoord: number) {
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
  setRedraw();
}

//Adjusts zoom according to scroll
export function mouseScroll(evt: React.WheelEvent<HTMLCanvasElement>) {
  if (tfCursor === undefined) {
    return null;
  }
  const zoomDelta = evt.deltaY < 0 ? 1 + zoomAmount : 1 - zoomAmount;
  zoom(zoomDelta, tfCursor.x, tfCursor.y);
  //redraw = true;
  setRedraw();
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
        //hoverNode = node;
        setHover(node);
      } else if (hoverNode == node) {
        //hoverNode = undefined;
        setHover(undefined);
        moveRedraw = true;
      }
    }
  });
  updateCoords();
  boundCoords();
  if (moveRedraw) {
    //redraw = true;
    setRedraw();
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
        if (startNode != undefined && path.length == 0) {
          setEndNode(node);
          //aStar();
          searchAlg();
        } else {
          //path = [];
          //frames = [[[]]];
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
    //path = [];
    //frames = [[[]]];
    resetPath();
  }
  delta.x = 0;
  delta.y = 0;
  boundCoords();
  //redraw = true;
  setRedraw();
}
