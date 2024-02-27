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
export function setHoverNode(inHover: MapNode | undefined) {
  hoverNode = inHover;
}
//Stores map delta xy coordinates while panning
let delta: { x: number; y: number } | undefined = { x: 0, y: 0 };
//Stores the start xy of mouse when pressed to test click clear or not
let pageStart: { x: number; y: number } | undefined = { x: 0, y: 0 };
// start position in image frame for translating when panning
let startPos: { x: number; y: number } | undefined = { x: 0, y: 0 };
// coordinates of mouse in map frame
let tfCursor: { x: number; y: number } | undefined = {
  x: window.innerWidth - drawData.offset.x,
  y: window.innerHeight - drawData.offset.y,
};

class Mouse {
  private imageWidth = 5000;
  private imageHeight = 3400;
  //Stores whether to update map position if moving
  private moveMap = false;
  private zoomAmount = 0.1;
  private newMap = true;

  private setDelta(xDelta: number, yDelta: number) {
    delta = { x: xDelta, y: yDelta };
  }

  private setPageStart(xPos: number, yPos: number) {
    pageStart = { x: xPos, y: yPos };
  }

  private setStartPos(xPos: number, yPos: number) {
    startPos = { x: xPos, y: yPos };
  }

  // zooms to a point
  public zoom(zoom: number, xCoord: number, yCoord: number) {
    drawData.updateCoords();
    if (
      (drawData.scalar * zoom * mouse.imageWidth > window.innerWidth ||
        drawData.scalar * zoom * mouse.imageHeight > window.innerHeight) &&
      (drawData.scalar * zoom * mouse.imageWidth < window.innerWidth * 10 ||
        drawData.scalar * zoom * mouse.imageHeight < window.innerHeight * 10)
    ) {
      drawData.setScalar(drawData.scalar * zoom);
      const scaleID = document.querySelector("#scalar");
      scaleID!.textContent = drawData.scalar.toFixed(2).toString();

      ctx!.translate(xCoord, yCoord);
      ctx!.scale(zoom, zoom);
      ctx!.translate(-xCoord, -yCoord);
    }
    drawData.updateCoords();
    mouse.boundCoords();
    //redraw = true;
    drawData.setRedraw(true);
  }
  public updateMousePos(pageX: number, pageY: number) {
    tfCursor = drawData.tfPoint(
      pageX - drawData.offset.x,
      pageY - drawData.offset.y,
    );
  }
  public inView(): boolean {
    if (
      drawData.upleftCorner === undefined ||
      drawData.downrightCorner === undefined
    ) {
      return false;
    }
    return (
      drawData.pathHighest.x > drawData.upleftCorner.x &&
      drawData.pathLowest.x < drawData.downrightCorner.x &&
      drawData.pathHighest.y > drawData.upleftCorner.y &&
      drawData.pathLowest.y < drawData.downrightCorner.y
    );
  }

  private setDim(startX: number, endX: number, startY: number, endY: number) {
    let posScale;
    const annHeight = 55;
    const heightDiff = endY - startY;
    const widthDiff = endX - startX;
    if (
      (window.innerHeight - annHeight) / heightDiff <
      window.innerWidth / widthDiff
    ) {
      posScale = (window.innerHeight - annHeight) / heightDiff;
    } else {
      posScale = window.innerWidth / widthDiff;
    }
    const posX =
      -(startX - (window.innerWidth - widthDiff * posScale) / 2) * posScale;
    const posY =
      -(startY - (window.innerHeight + annHeight - heightDiff * posScale) / 2) *
      posScale;
    return { x: posX, y: posY, scale: posScale };
  }

  // resets map position to a default position
  public homePosition(homeFloor: string) {
    if (ctx === null) {
      return;
    }
    let dim = { x: 0, y: 0, scale: 1 };

    if (homeFloor === "3") {
      dim = mouse.setDim(1210, 2890, 750, 3060);
    } else if (homeFloor === "2") {
      dim = mouse.setDim(1260, 4670, 350, 2880);
    } else if (homeFloor === "1") {
      dim = mouse.setDim(960, 3280, 680, 2980);
    } else if (homeFloor === "L1") {
      dim = mouse.setDim(1620, 2790, 820, 2400);
    } else if (homeFloor === "L2") {
      dim = mouse.setDim(1490, 2380, 780, 2930);
    }
    ctx!.translate(dim.x, dim.y);
    drawData.updateCoords();
    drawData.setScalar(dim.scale);
    ctx!.scale(dim.scale, dim.scale);
    drawData.updateCoords();
    mouse.boundCoords();
    const scaleID = document.querySelector("#scalar");
    scaleID!.textContent = drawData.scalar.toFixed(2).toString();
  }
  public buttonZoom(input: boolean) {
    let zoomIncrement: number;
    const multiplier = 5;
    if (input) zoomIncrement = 1 + multiplier * mouse.zoomAmount;
    else zoomIncrement = 1 - multiplier * mouse.zoomAmount;
    mouse.zoom(zoomIncrement, drawData.centerPos!.x, drawData.centerPos!.y);
  }
  public setMap(floor: string, imageSrc: string) {
    if (mouse.newMap) {
      mouse.newMap = false;
      const tempScalar = drawData.scalar;
      ctx!.save();
      let newFloor = true;
      if (drawData.currentFloor === floor) {
        newFloor = false;
      }
      const hasPath = drawData.resetMap(newFloor);
      drawData.setCurrentFloor(floor);
      drawData.setImage(imageSrc);
      mouse.homePosition(floor);
      ctx!.restore();
      drawData.setScalar(tempScalar);
      if (!hasPath) {
        drawData.resetMap(newFloor);
        mouse.homePosition(floor);
      }
      const scaleID = document.querySelector("#scalar");
      scaleID!.textContent = drawData.scalar.toFixed(2).toString();
      drawData.resetPath();
      mouse.newMap = true;

      return true;
    }
    return false;
  }
  public boundCoords() {
    if (
      drawData.downrightCorner === undefined ||
      drawData.upleftCorner === undefined
    )
      return null;
    if (
      drawData.downrightCorner.x - drawData.upleftCorner.x >
      mouse.imageWidth
    ) {
      // centers canvas along x axis
      ctx!.translate(drawData.upleftCorner.x, 0);
      drawData.updateCoords();
      ctx!.translate(
        (drawData.downrightCorner.x -
          mouse.imageWidth -
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
        mouse.imageWidth + drawData.offset.x / drawData.scalar
      ) {
        // aligns canvas along right side
        ctx!.translate(
          -mouse.imageWidth -
            drawData.offset.x / drawData.scalar +
            drawData.downrightCorner.x,
          0,
        );
      }
    }
    if (
      drawData.downrightCorner.y - drawData.upleftCorner.y >
      mouse.imageHeight
    ) {
      // centers canvas along y axis
      ctx!.translate(0, drawData.upleftCorner.y);
      drawData.updateCoords();
      ctx!.translate(
        0,
        (drawData.downrightCorner.y -
          mouse.imageHeight -
          drawData.offset.y / drawData.scalar) /
          2,
      );
    } else {
      if (drawData.upleftCorner.y < 0) {
        // aligns canvas along top side
        ctx!.translate(0, drawData.upleftCorner.y);
      } else if (
        drawData.downrightCorner.y >
        mouse.imageHeight + drawData.offset.y / drawData.scalar
      ) {
        // aligns canvas along bottom side
        ctx!.translate(
          0,
          -mouse.imageHeight -
            drawData.offset.y / drawData.scalar +
            drawData.downrightCorner.y,
        );
      }
    }
    drawData.updateCoords();
  }
  //Adjusts zoom according to scroll
  public mouseScroll(evt: React.WheelEvent<HTMLCanvasElement>) {
    mouse.updateMousePos(evt.pageX, evt.pageY);
    if (tfCursor === undefined) {
      return null;
    }
    const zoomDelta =
      evt.deltaY < 0 ? 1 + mouse.zoomAmount : 1 - mouse.zoomAmount;
    mouse.zoom(zoomDelta, tfCursor.x, tfCursor.y);
    //redraw = true;
    drawData.setRedraw(true);
  }

  private clickMove(posX: number, posY: number) {
    let moveRedraw = false;
    mouse.updateMousePos(posX, posY);

    if (
      delta === undefined ||
      tfCursor === undefined ||
      startPos === undefined
    ) {
      return null;
    }

    if (mouse.moveMap) {
      const currDelta = { x: delta.x, y: delta.y };
      mouse.setDelta(posX - pageStart!.x, posY - pageStart!.y);
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
        if (
          dist < 10 &&
          ((drawData.showNodes && node.nodeType !== "HALL") ||
            (drawData.showHalls && node.nodeType === "HALL"))
        ) {
          if (hoverNode !== node) {
            moveRedraw = true;
            document.getElementById("map-canvas")!.style.cursor = "pointer";
          }
          hoverNode = node;
        } else if (hoverNode === node) {
          hoverNode = undefined;
          moveRedraw = true;
          document.getElementById("map-canvas")!.style.cursor = "auto";
        }
      }
    });

    if (moveRedraw) {
      drawData.updateCoords();
      mouse.boundCoords();
      //redraw = true;
      drawData.setRedraw(true);
    }
  }

  // runs for moving mouse
  public mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
    if (!mouse.touch) {
      mouse.clickMove(evt.pageX, evt.pageY);
    }
  }

  public clickDown(posX: number, posY: number) {
    mouse.updateMousePos(posX, posY);
    if (hoverNode === undefined) {
      document.getElementById("map-canvas")!.style.cursor = "all-scroll";
    }
    if (pageStart === undefined) {
      return null;
    }
    mouse.setPageStart(posX, posY);
    mouse.moveMap = true;
    const posStart = drawData.tfPoint(posX, posY);
    mouse.setStartPos(posStart!.x, posStart!.y);
    mouse.boundCoords();
  }

  //Starts moving map according to mouse drag
  public mouseDown(evt: React.MouseEvent<Element, MouseEvent>) {
    mouse.clickDown(evt.pageX, evt.pageY);
  }

  private elementUp(posX: number, posY: number) {
    if (hoverNode === undefined)
      document.getElementById("map-canvas")!.style.cursor = "auto";
    if (tfCursor === undefined || delta === undefined) {
      return null;
    }
    posX;
    posY;
    mouse.moveMap = false;
    mouse.setDelta(0, 0);
    mouse.boundCoords();
    drawData.setRedraw(true);
  }

  public divMouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
    mouse.elementUp(evt.pageX, evt.pageY);
  }

  public divTouchUp(evt: React.TouchEvent<HTMLDivElement>) {
    mouse.touch = false;
    if (evt.touches.length === 1) {
      mouse.elementUp(evt.touches[0].pageX, evt.touches[0].pageY);
    }
  }

  public clickUp(posX: number, posY: number) {
    if (hoverNode === undefined)
      document.getElementById("map-canvas")!.style.cursor = "auto";
    if (tfCursor === undefined || delta === undefined) {
      return null;
    }
    mouse.moveMap = false;
    posX;
    posY;
    let emptyClick = true;
    mapNodes.forEach((node) => {
      if (node.floor === drawData.currentFloor) {
        const dist = Math.sqrt(
          Math.pow(tfCursor!.x - node.xcoord, 2) +
            Math.pow(tfCursor!.y - node.ycoord, 2),
        );
        if (
          dist < 10 &&
          ((drawData.showNodes && node.nodeType !== "HALL") ||
            (drawData.showHalls && node.nodeType === "HALL"))
        ) {
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
    if (emptyClick && Math.abs(delta.x) <= 5 && Math.abs(delta.y) <= 5) {
      drawData.setSwitchNodes([], []);
      setStartNode(undefined);
      setEndNode(undefined);
      nodeStore.setSelectedNode(undefined);
      drawData.resetPath();
    }
    mouse.setDelta(0, 0);
    mouse.boundCoords();
    drawData.setRedraw(true);
  }

  // runs when mouse released
  public mouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
    mouse.clickUp(evt.pageX, evt.pageY);
  }

  public canvasTouchStart(evt: React.TouchEvent<HTMLCanvasElement>) {
    if (evt.touches.length === 1) {
      const touch = { x: evt.touches[0].pageX, y: evt.touches[0].pageY };
      mouse.clickDown(touch.x, touch.y);
    }
  }

  public canvasTouchEnd(evt: React.TouchEvent<HTMLCanvasElement>) {
    if (evt.touches.length === 1) {
      const touch = { x: evt.touches[0].pageX, y: evt.touches[0].pageY };
      mouse.clickUp(touch.x, touch.y);
    }
  }

  public canvasTouchMove(
    evt: React.TouchEvent<HTMLCanvasElement> | React.TouchEvent<HTMLDivElement>,
  ) {
    if (evt.touches.length === 1) {
      const touch = { x: evt.touches[0].pageX, y: evt.touches[0].pageY };
      mouse.clickMove(touch.x, touch.y);
    }
  }
  private touch = false;

  public divTouchStart(evt: React.TouchEvent<HTMLDivElement>) {
    mouse.touch = true;
    evt;
  }
}

export const mouse = new Mouse();
