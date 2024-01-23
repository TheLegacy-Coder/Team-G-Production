import React, { useEffect, useReducer, useRef } from "react";
import { BreadthFirstSearch, MapNode, mapNodes } from "../map/MapNode.ts";

const imageWidth = 5000;
const imageHeight = 3400;
let yOffset = 0;
let xOffset = 0;
let hl: MapNode | undefined = undefined;
let sl: MapNode | undefined = undefined;
let path: MapNode[] = [];
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
    ctx?.drawImage(image, 0, 0);
    let last: MapNode | undefined = undefined;
    ctx!.strokeStyle = "#0000FF";
    path.forEach((p) => {
      if (last != undefined) {
        ctx!.beginPath(); // Start a new path
        ctx!.moveTo(last.xcoord, last.ycoord); // Move the pen to (30, 50)
        ctx!.lineTo(p.xcoord, p.ycoord); // Draw a line to (150, 100)
        ctx!.stroke(); // Render the path
      }
      last = p;
    });
    mapNodes.forEach((node) => {
      ctx!.beginPath();
      ctx!.arc(node.xcoord, node.ycoord, 10, 0, 2 * Math.PI, false);
      ctx!.fillStyle =
        sl == node ? "#00FF00" : hl == node ? "#0000FF" : "#FF0000";
      ctx!.fill();
      ctx!.lineWidth = 5;
      ctx!.strokeStyle = "#330000";
      ctx!.stroke();
      if (node == hl || node == sl) {
        ctx!.fillStyle = "#FFFFFF";
        ctx!.strokeStyle = "#000000";
        ctx!.fillRect(node.xcoord - 80, node.ycoord + 15, 160, 20);
        ctx!.strokeRect(node.xcoord - 80, node.ycoord + 15, 160, 20);
        ctx!.font = "bold 10pt Courier";
        ctx!.textAlign = "center";
        ctx!.fillStyle = "#550000";
        ctx!.fillText(node.shortName, node.xcoord, node.ycoord + 28);
      }
    });
  }

  image.onload = () => {
    draw();
  };

  function mouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
    const x = evt.pageX - xOffset;
    const y = evt.pageY - yOffset;

    let emptyClick = true;
    mapNodes.forEach((node) => {
      const dist = Math.sqrt(
        Math.pow(x - node.xcoord, 2) + Math.pow(y - node.ycoord, 2),
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
    if (emptyClick) {
      hl = undefined;
      sl = undefined;
      path = [];
    }
    draw();
  }
  function mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
    if (ctx == null) return;

    const x = evt.pageX - xOffset;
    const y = evt.pageY - yOffset;

    mapNodes.forEach((node) => {
      const dist = Math.sqrt(
        Math.pow(x - node.xcoord, 2) + Math.pow(y - node.ycoord, 2),
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
      ref={canvasRef}
      width={imageWidth}
      height={imageHeight}
    ></canvas>
  );
};
