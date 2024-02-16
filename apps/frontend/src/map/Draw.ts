//import React from "react";

/**
 * Completed
 */

import {
  MapNode,
  mapNodes,
  mapEdges,
  getStartNode,
  getEndNode,
} from "./MapNode.ts";

/**
 * NOT Completed
 */
import { hoverNode, inView, homePosition } from "./Mouse.ts";

import {
  frames,
  redraw,
  scalar,
  floors,
  currentFloor,
  setRedraw,
  image,
  ctx,
} from "./DrawData.ts";

/**
 * Issues that are occurring
 * swapping between clicking nodes and selecting nodes not causing side buttons to update
 * pathInView causing bottom path from L2 to F3 to not draw
 */

/**
 * Start Exported types
 */

/**
 * End Exported types
 */

let drawStep = 0;
let showEdges = false;

export function toggleEdges() {
  showEdges = !showEdges;
  setRedraw(true);
}

//let ctx = canvasCtxRef.current;

function draw() {
  if (redraw) {
    // verifies canvas context is set up
    //ctx = canvasCtxRef.current;
    if (ctx == null) {
      return;
    }

    drawStep = drawStep - 1 >= 1 ? drawStep - 1 : 50;
    // save the context data for tf
    ctx!.save();
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx!.restore();
    // draws image
    ctx!.drawImage(image, 0, 0);

    //if draw edges
    if (showEdges) {
      mapNodes.forEach((node) => {
        if (node.floor === currentFloor) {
          ctx!.lineWidth = 3;
          ctx!.strokeStyle = "#AAAAAA";
          node.edges.forEach((edge) => {
            if (edge.floor === currentFloor) {
              // Start a new Path
              ctx!.beginPath();
              ctx!.moveTo(node.xcoord, node.ycoord);
              ctx!.lineTo(edge.xcoord, edge.ycoord);
              // Draw the Path
              ctx!.stroke();
            }
          });
        }
      });
    }

    // draws the path trail
    if (frames[drawStep] != undefined) {
      frames[drawStep].forEach((frame) => {
        ctx!.beginPath();
        ctx!.arc(frame[0], frame[1], 5, 0, 2 * Math.PI, false);
        ctx!.fillStyle = "#0000FF";
        ctx!.fill();
      });
    }

    mapNodes.forEach((node) => {
      if (node.floor === currentFloor) {
        ctx!.beginPath();
        ctx!.arc(node.xcoord, node.ycoord, 10, 0, 2 * Math.PI, false);
        ctx!.fillStyle =
          getStartNode() == node
            ? "#00FF00"
            : getEndNode() == node
              ? "#00ffff"
              : hoverNode == node
                ? "#0000FF"
                : "#FF0000";
        ctx!.fill();
        ctx!.lineWidth = 5;
        ctx!.strokeStyle = "#330000";
        ctx!.stroke();
      }
    });

    if (hoverNode !== undefined) drawNodeDetails(hoverNode);

    //let pathInView = false;
    if (inView()) {
      //pathInView = true;
    }

    let currentSelectedFloor = currentFloor;
    if (currentSelectedFloor.length == 1) {
      currentSelectedFloor = "F" + currentSelectedFloor;
    }
    if (
      getStartNode() === undefined ||
      getEndNode() === undefined ||
      !floors.includes(currentSelectedFloor) /* ||
                !pathInView*/
    )
      setRedraw(false);
  }
  setTimeout(draw, 16);
}

function getContentWidth(prevNum: number, inString: string): number {
  if (inString.length > prevNum) {
    return inString.length;
  }
  return prevNum;
}

function drawNodeDetails(node: MapNode) {
  ctx!.fillStyle = "#FFFFFF";
  ctx!.strokeStyle = "#000000";
  ctx!.lineWidth = 5 / scalar;
  const content: string[] = [];
  let contentWidth: number = node.shortName.length;
  content.push(node.shortName);
  contentWidth = getContentWidth(
    contentWidth,
    "x: " + node.xcoord.toString() + ", y: " + node.ycoord.toString(),
  );
  content.push(
    "x: " + node.xcoord.toString() + ", y: " + node.ycoord.toString(),
  );
  content.push("Adjacent Nodes:");
  contentWidth = getContentWidth(contentWidth, "Adjacent Nodes:");
  let lineCount = 3;
  for (let i = 0; i < node.edges.length; i++) {
    lineCount++;
    content.push(node.edges[i].shortName);
    contentWidth = getContentWidth(contentWidth, node.edges[i].shortName);
  }
  content.push("Adjacent Edges:");
  contentWidth = getContentWidth(contentWidth, "Adjacent Edges:");
  lineCount++;

  for (let i = 0; i < node.edges.length; i++) {
    lineCount++;
    let lineContent = "";
    mapEdges.forEach((edge) => {
      if (
        (edge.startNode === node.nodeID &&
          edge.endNode === node.edges[i].nodeID) ||
        (edge.endNode === node.nodeID &&
          edge.startNode === node.edges[i].nodeID)
      ) {
        lineContent = edge.edgeID;
      }
    });
    content.push(lineContent);
    contentWidth = getContentWidth(contentWidth, lineContent);
  }

  ctx!.fillRect(
    node.xcoord - (contentWidth * 9) / 2 / scalar,
    node.ycoord + 15,
    (contentWidth * 9) / scalar,
    5 + (15 / scalar) * lineCount,
  );
  ctx!.strokeRect(
    node.xcoord - (contentWidth * 9) / 2 / scalar,
    node.ycoord + 15,
    (contentWidth * 9) / scalar,
    5 + (15 / scalar) * lineCount,
  );
  ctx!.font = "bold " + (10 / scalar).toString() + "pt Courier";
  ctx!.textAlign = "center";
  ctx!.fillStyle = "#550000";
  for (let i = 0; i < lineCount; i++) {
    ctx!.fillText(
      content[i],
      node.xcoord,
      node.ycoord + 14 + (14 / scalar) * (i + 1),
    );
  }
}

//Draws on canvas when map image loaded
image.onload = () => {
  draw();
  homePosition();
  setTimeout(() => {
    setRedraw(true);
  }, 25);
};
