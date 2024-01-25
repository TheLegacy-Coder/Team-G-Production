import React, { useEffect, useReducer, useRef } from "react";
import { BreadthFirstSearch, MapNode, mapNodes } from "../map/MapNode.ts";

let imageWidth = 5000;
let imageHeight = 3400;
let yOffset = 0;
let xOffset = 0;
let hl: MapNode | undefined = undefined;
let sl: MapNode | undefined = undefined;
let path: MapNode[] = [];

let scalar = 1.0;
let mapX = 0.0;
let mapY = 0.0;
let xDelta = 0;
let yDelta = 0;
let startX = 0;
let startY = 0;
let moveMap = false;
export const InteractableMap = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const ctx = canvasCtxRef.current;

  const image = new Image();
  image.src = "00_thelowerlevel1.png";
  setTimeout(forceUpdate, 100);

  function draw() {
    if (ctx == null) return;

    const scaled = scalar;

    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    ctx!.clearRect(0, 0, width, height);

    ctx!.scale(scaled, scaled);
    ctx?.drawImage(image, mapX + xDelta, mapY + yDelta);
    let last: MapNode | undefined = undefined;
    ctx!.strokeStyle = "#0000FF";
    path.forEach((p) => {
      if (last != undefined) {
        ctx!.beginPath(); // Start a new path
        ctx!.moveTo(last.xcoord + mapX + xDelta, last.ycoord + mapY + yDelta); // Move the pen to (30, 50)
        ctx!.lineTo(p.xcoord + mapX + xDelta, p.ycoord + mapY + yDelta); // Draw a line to (150, 100)
        ctx!.stroke(); // Render the path
      }
      last = p;
    });
    mapNodes.forEach((node) => {
      ctx!.beginPath();
      ctx!.arc(
        node.xcoord + mapX + xDelta,
        node.ycoord + mapY + yDelta,
        10,
        0,
        2 * Math.PI,
        false,
      );
      ctx!.fillStyle =
        sl == node ? "#00FF00" : hl == node ? "#0000FF" : "#FF0000";
      ctx!.fill();
      ctx!.lineWidth = 5;
      ctx!.strokeStyle = "#330000";
      ctx!.stroke();
      if (node == hl || node == sl) {
        ctx!.fillStyle = "#FFFFFF";
        ctx!.strokeStyle = "#000000";
        ctx!.fillRect(
          node.xcoord - 80 + mapX + xDelta,
          node.ycoord + 15 + mapY + yDelta,
          160,
          20,
        );
        ctx!.strokeRect(
          node.xcoord - 80 + mapX + xDelta,
          node.ycoord + 15 + mapY + yDelta,
          160,
          20,
        );
        ctx!.font = "bold 10pt Courier";
        ctx!.textAlign = "center";
        ctx!.fillStyle = "#550000";
        ctx!.fillText(
          node.shortName,
          node.xcoord + mapX + xDelta,
          node.ycoord + 28 + mapY + yDelta,
        );
      }
    });

    imageWidth = width;
    imageHeight = height;

    ctx!.scale(1 / scaled, 1 / scaled);
  }

  image.onload = () => {
    draw();
  };

  function getXY(evt: React.MouseEvent<Element, MouseEvent>): {
    x: number;
    y: number;
  } {
    if (moveMap) {
      xDelta = (evt.pageX - startX) / scalar;
      yDelta = (evt.pageY - startY) / scalar;
    }

    const x = (evt.pageX - xOffset) / scalar - mapX;
    const y = (evt.pageY - yOffset) / scalar - mapY;
    return { x, y };
  }

  function mouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
    const cord = getXY(evt);

    let emptyClick = true;
    mapNodes.forEach((node) => {
      const dist = Math.sqrt(
        Math.pow(cord.x - node.xcoord, 2) + Math.pow(cord.y - node.ycoord, 2),
      );
      if (dist < 10) {
        emptyClick = false;
        if (sl != undefined && path.length == 0) {
          path = BreadthFirstSearch(sl, node);
        } else {
          path = [];
          sl = node;
        }
      }
    });
    if (emptyClick && xDelta == 0 && yDelta == 0) {
      hl = undefined;
      sl = undefined;
      path = [];
    }
    draw();
    moveMap = false;
    mapX += xDelta;
    mapY += yDelta;
    xDelta = 0;
    yDelta = 0;
  }

  function mouseDown(evt: React.MouseEvent<Element, MouseEvent>) {
    startX = evt.pageX;
    startY = evt.pageY;
    moveMap = true;
  }

  function mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
    if (ctx == null) return;

    const cord = getXY(evt);

    mapNodes.forEach((node) => {
      const dist = Math.sqrt(
        Math.pow(cord.x - node.xcoord, 2) + Math.pow(cord.y - node.ycoord, 2),
      );
      if (dist < 10 && path.length == 0) {
        hl = node;
        forceUpdate();
      } else {
        if (hl == node && path.length == 0) hl = undefined;
      }
    });
    draw();
  }

  function mouseScroll(evt: React.WheelEvent<HTMLCanvasElement>) {
    if (ctx == null) return;

    const delta = evt.deltaY;

    if (delta > 0 && scalar < 1.5) {
      scalar *= 1.2;
    } else if (delta < 0 && scalar > 0.1) {
      scalar *= 1 / 1.2;
    }
  }

  useEffect(() => {
    // Initialize
    if (canvasRef.current) {
      const { offsetTop } = canvasRef.current;
      const { offsetLeft } = canvasRef.current;
      yOffset = offsetTop;
      xOffset = offsetLeft;
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
  }, [ctx]);

  return (
    <canvas
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onMouseDown={mouseDown}
      onWheel={mouseScroll}
      ref={canvasRef}
      width={imageWidth}
      height={imageHeight}
    ></canvas>
  );
};
