import React, { useEffect, useReducer, useRef } from "react";
import { BreadthFirstSearch, MapNode, mapNodes } from "../map/MapNode.ts";

const imageWidth = 5000;
const imageHeight = 3400;
let yOffset = 0;
let xOffset = 0;
let hl: MapNode | undefined = undefined;
let sl: MapNode | undefined = undefined;
let path: MapNode[] = [];
let flip = false;

let totalDistance = 0;
let steps: number[] = [];
let drawStep = 0;
let frames: number[][][] = [[[]]];
const spacing = 50;

export const InteractableMap = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const ctx = canvasCtxRef.current;

  const image = new Image();
  image.src = "00_thelowerlevel1.png";
  setTimeout(draw, 100);

  function draw() {
    drawStep = drawStep - 1 >= 0 ? drawStep - 1 : 50;
    if (ctx == null) return;
    ctx?.drawImage(image, 0, 0);
    if (frames[drawStep] != undefined) {
      frames[drawStep].forEach((frame) => {
        ctx!.beginPath();
        ctx!.arc(frame[0], frame[1], 5, 0, 2 * Math.PI, false);
        ctx!.fillStyle = "#0000FF";
        ctx!.fill();
      });
    }

    flip = !flip;
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

    forceUpdate();
    if (path.length > 0) setTimeout(draw, 10);
    console.log("drawStep:", drawStep);
  }

  image.onload = () => {
    //draw();
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
          totalDistance = 0;
          steps = [0];
          let last: MapNode | undefined = undefined;
          path.forEach((node) => {
            if (last != undefined) {
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
            const temp = [];
            for (let i = 0; i < totalDistance / spacing; i++) {
              let prog = spacing * i + (f % spacing);
              let s = 0;
              while (s < path.length) {
                if (prog < steps[s]) {
                  break;
                }
                s++;
              }
              s--;
              prog -= steps[s];
              if (s + 1 < path.length) {
                const angleRadians = Math.atan2(
                  path[s].ycoord - path[s + 1].ycoord,
                  path[s].xcoord - path[s + 1].xcoord,
                );
                const x = path[s].xcoord - Math.cos(angleRadians) * prog;
                const y = path[s].ycoord - Math.sin(angleRadians) * prog;
                temp.push([x, y]);
              }
            }
            frames.push(temp);
          }
          console.log("frames");
          console.log(frames);
        } else {
          path = [];
          frames = [[[]]];
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
    let changed = false;
    mapNodes.forEach((node) => {
      const dist = Math.sqrt(
        Math.pow(x - node.xcoord, 2) + Math.pow(y - node.ycoord, 2),
      );
      if (dist < 10 && path.length == 0) {
        hl = node;
        changed = true;
      } else {
        if (hl == node && path.length == 0 && hl != undefined) {
          changed = true;
          hl = undefined;
        }
      }
    });
    if (changed) draw();
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
