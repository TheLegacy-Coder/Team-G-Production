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
    this.boundCoords();
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
    /*console.log(
      "In view X:\nPath lowest: " +
        drawData.pathLowest.x +
        "\nPath Highest: " +
        drawData.pathHighest.x +
        "\nUp left: " +
        drawData.upleftCorner!.x +
        "\nDown right: " +
        drawData.downrightCorner!.x +
        "\nIn view Y:\nPath lowest: " +
        drawData.pathLowest.y +
        "\nPath Highest: " +
        drawData.pathHighest.y +
        "\nUp left: " +
        drawData.upleftCorner!.y +
        "\nDown right: " +
        drawData.downrightCorner!.y,
    );*/
    if (
      drawData.upleftCorner === undefined ||
      drawData.downrightCorner === undefined
    ) {
      return false;
    }
    const result =
      drawData.pathHighest.x > drawData.upleftCorner.x &&
      drawData.pathLowest.x < drawData.downrightCorner.x &&
      drawData.pathHighest.y > drawData.upleftCorner.y &&
      drawData.pathLowest.y < drawData.downrightCorner.y;
    if (result) {
      drawData.setRedraw(true);
    }
    return result;
  }
  // resets map position to a default position
  public homePosition() {
    if (ctx === null) {
      return;
    }
    ctx!.translate(-1200, -400);
    drawData.updateCoords();
    //scalar = 0.75;
    drawData.setScalar(0.75);
    ctx!.scale(0.75, 0.75);
    drawData.updateCoords();
    this.boundCoords();
    const scaleID = document.querySelector("#scalar");
    scaleID!.textContent = drawData.scalar.toFixed(2).toString();
  }
  public buttonZoom(input: boolean) {
    let zoomIncrement: number;
    if (input) zoomIncrement = 1 + mouse.zoomAmount;
    else zoomIncrement = 1 - mouse.zoomAmount;
    this.zoom(zoomIncrement, drawData.centerPos!.x, drawData.centerPos!.y);
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
      drawData.resetMap(newFloor);
      //currentFloor = floor;
      drawData.setCurrentFloor(floor);
      drawData.setImage(imageSrc);
      this.homePosition();
      mouse.newMap = true;
      ctx!.restore();
      drawData.setScalar(tempScalar);
      const scaleID = document.querySelector("#scalar");
      scaleID!.textContent = drawData.scalar.toFixed(2).toString();
      drawData.resetPath();
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
      this.imageWidth
    ) {
      // centers canvas along x axis
      ctx!.translate(drawData.upleftCorner.x, 0);
      drawData.updateCoords();
      ctx!.translate(
        (drawData.downrightCorner.x -
          this.imageWidth -
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
        this.imageWidth + drawData.offset.x / drawData.scalar
      ) {
        // aligns canvas along right side
        ctx!.translate(
          -this.imageWidth -
            drawData.offset.x / drawData.scalar +
            drawData.downrightCorner.x,
          0,
        );
      }
    }
    if (
      drawData.downrightCorner.y - drawData.upleftCorner.y >
      this.imageHeight
    ) {
      // centers canvas along y axis
      ctx!.translate(0, drawData.upleftCorner.y);
      drawData.updateCoords();
      ctx!.translate(
        0,
        (drawData.downrightCorner.y -
          this.imageHeight -
          drawData.offset.y / drawData.scalar) /
          2,
      );
    } else {
      if (drawData.upleftCorner.y < 0) {
        // aligns canvas along top side
        ctx!.translate(0, drawData.upleftCorner.y);
      } else if (
        drawData.downrightCorner.y >
        this.imageHeight + drawData.offset.y / drawData.scalar
      ) {
        // aligns canvas along bottom side
        ctx!.translate(
          0,
          -this.imageHeight -
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
  // runs for moving mouse
  public mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
    let moveRedraw = false;
    mouse.updateMousePos(evt.pageX, evt.pageY);

    if (
      delta === undefined ||
      tfCursor === undefined ||
      startPos === undefined
    ) {
      return null;
    }

    if (mouse.moveMap) {
      const currDelta = { x: delta.x, y: delta.y };
      mouse.setDelta(evt.pageX - pageStart!.x, evt.pageY - pageStart!.y);
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
    mouse.boundCoords();
    if (moveRedraw) {
      //redraw = true;
      drawData.setRedraw(true);
    }
  }
  //Starts moving map according to mouse drag
  public mouseDown(evt: React.MouseEvent<Element, MouseEvent>) {
    mouse.updateMousePos(evt.pageX, evt.pageY);
    if (pageStart === undefined) {
      return null;
    }
    mouse.setPageStart(evt.pageX, evt.pageY);
    mouse.moveMap = true;
    const posStart = drawData.tfPoint(evt.pageX, evt.pageY);
    mouse.setStartPos(posStart!.x, posStart!.y);
    mouse.boundCoords();
  }
  // runs when mouse released
  public mouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
    if (tfCursor === undefined || delta === undefined) {
      console.log("null mouse up");
      return null;
    }
    mouse.moveMap = false;
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
    if (emptyClick && delta.x === 0 && delta.y === 0) {
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
}

export const mouse = new Mouse();
