import React, { useEffect, useRef } from "react";
import { AStarSearch, MapNode, mapNodes, nodeStore } from "../map/MapNode.ts";
import "../components/styles/ZoomButton.css";

const canvasSize = { x: 0, y: 0 };
const offset = { x: 0, y: 0 };
let hl: MapNode | undefined = undefined;
let sl: MapNode | undefined = undefined;
let path: MapNode[] = [];

let flip = false;

let totalDistance = 0;
let steps: number[] = [];
let drawStep = 0;
let frames: number[][][] = [[[]]];
const spacing = 50;

let showEdges = false;

//Stores scaled map amount
let scalar = 1;
//Stores map delta xy coordinates while panning
const delta = { x: 0, y: 0 };
//Stores the start xy of mouse when pressed to test click clear or not
const pageStart = { x: 0, y: 0 };
//Stores whether to update map position if moving
let moveMap = false;
// start position in image frame for translating when panning
let startPos = { x: 0, y: 0 };
// coordinates of mouse in map frame
let tfCursor = { x: 0, y: 0 };
let centerPos = { x: 0, y: 0 };
let upleftCorner = { x: 0, y: 0 };
let downrightCorner = { x: 0, y: 0 };

const zoomAmount = 0.1;

export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  let ctx = canvasCtxRef.current;

  const image = new Image();
  image.src = "00_thelowerlevel1.png";

  function getWidth(): number {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    canvasSize.x = width;
    return width;
  }

  function getHeight(): number {
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    canvasSize.y = height;
    return height;
  }

  // converts coordinates from page frame to image frame
  function tfPoint(x: number, y: number) {
    const origin = new DOMPoint(x, y);
    return ctx!.getTransform().invertSelf().transformPoint(origin);
  }

  function draw() {
    // verifies canvas context is set up
    ctx = canvasCtxRef.current;
    if (ctx == null) {
      return;
    }

    drawStep = drawStep - 1 >= 1 ? drawStep - 1 : 50;
    // save the context data for tf
    ctx!.save();
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.clearRect(0, 0, canvasSize.x, canvasSize.y);
    ctx!.restore();
    // draws image
    ctx!.drawImage(image, 0, 0);

    //if draw edges
    if (showEdges) {
      mapNodes.forEach((node) => {
        // wrap in if
        ctx!.lineWidth = 3;
        ctx!.strokeStyle = "#AAAAAA";
        node.edges.forEach((edge) => {
          // Start a new Path
          ctx!.beginPath();
          ctx!.moveTo(node.xcoord, node.ycoord);
          ctx!.lineTo(edge.xcoord, edge.ycoord);
          // Draw the Path
          ctx!.stroke();
        });
      });
    }

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

    setTimeout(draw, 15);
  }

  //Draws on canvas when map image loaded
  image.onload = () => {
    draw();
    homePosition();
  };

  // resets map position to a default position
  function homePosition() {
    ctx!.translate(-1200, -400);
    updateCoords();
    scalar = 0.75;
    ctx!.scale(0.75, 0.75);
    updateCoords();
    boundCoords();
    const scaleID = document.querySelector("#scalar");
    scaleID!.textContent = scalar.toFixed(2).toString();
  }

  // updates coordinate points for map panning and zooming
  function updateCoords() {
    centerPos = tfPoint(
      (canvasSize.x - offset.x) / 2,
      (canvasSize.y - offset.y) / 2,
    );
    upleftCorner = tfPoint(0, 0);
    downrightCorner = tfPoint(canvasSize.x, canvasSize.y);
  }

  function boundCoords() {
    if (downrightCorner.x - upleftCorner.x > image.width) {
      // centers canvas along x axis
      ctx!.translate(upleftCorner.x, 0);
      updateCoords();
      ctx!.translate(
        (downrightCorner.x - image.width - offset.x / scalar) / 2,
        0,
      );
    } else {
      if (upleftCorner.x < 0) {
        // aligns canvas along left side
        ctx!.translate(upleftCorner.x, 0);
      } else if (downrightCorner.x > image.width + offset.x / scalar) {
        // aligns canvas along right side
        ctx!.translate(-image.width - offset.x / scalar + downrightCorner.x, 0);
      }
    }
    if (downrightCorner.y - upleftCorner.y > image.height) {
      // centers canvas along y axis
      ctx!.translate(0, upleftCorner.y);
      updateCoords();
      ctx!.translate(
        0,
        (downrightCorner.y - image.height - offset.y / scalar) / 2,
      );
    } else {
      if (upleftCorner.y < 0) {
        // aligns canvas along top side
        ctx!.translate(0, upleftCorner.y);
      } else if (downrightCorner.y > image.height + offset.y / scalar) {
        // aligns canvas along bottom side
        ctx!.translate(
          0,
          -image.height - offset.y / scalar + downrightCorner.y,
        );
      }
    }
    updateCoords();
  }

  // runs when mouse reeased
  function mouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
    moveMap = false;
    evt.pageX;
    let emptyClick = true;
    mapNodes.forEach((node) => {
      const dist = Math.sqrt(
        Math.pow(tfCursor.x - node.xcoord, 2) +
          Math.pow(tfCursor.y - node.ycoord, 2),
      );
      if (dist < 10) {
        emptyClick = false;
        if (sl != undefined && path.length == 0) {
          path = AStarSearch(sl, node);
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
        } else {
          path = [];
          frames = [[[]]];
          sl = node;
          nodeStore.setSelectedNode(sl);
        }
      }
    });
    if (emptyClick && delta.x == 0 && delta.y == 0) {
      hl = undefined;
      sl = undefined;
      nodeStore.setSelectedNode(sl);
      path = [];
      frames = [[[]]];
    }
    delta.x = 0;
    delta.y = 0;
    boundCoords();
  }

  //Starts moving map according to mouse drag
  function mouseDown(evt: React.MouseEvent<Element, MouseEvent>) {
    pageStart.x = evt.pageX;
    pageStart.y = evt.pageY;
    moveMap = true;
    startPos = tfPoint(evt.pageX, evt.pageY);
    boundCoords();
  }

  // runs for moving mouse
  function mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
    tfCursor = tfPoint(evt.pageX - offset.x, evt.pageY - offset.y);

    if (moveMap) {
      delta.x = evt.pageX - pageStart.x;
      delta.y = evt.pageY - pageStart.y;
      ctx!.translate(
        tfCursor.x + offset.x / scalar - startPos.x,
        tfCursor.y + offset.y / scalar - startPos.y,
      );
    }
    mapNodes.forEach((node) => {
      const dist = Math.sqrt(
        Math.pow(tfCursor.x - node.xcoord, 2) +
          Math.pow(tfCursor.y - node.ycoord, 2),
      );
      if (dist < 10 && path.length == 0) {
        hl = node;
        //changed = true;
      } else {
        if (hl == node && path.length == 0) {
          //changed = true;
          hl = undefined;
        }
      }
    });
    updateCoords();
    boundCoords();
  }

  // zooms to a point
  function zoom(zoom: number, xCoord: number, yCoord: number) {
    if (scalar * zoom > 0.3 && scalar * zoom < 2) {
      scalar *= zoom;
      const scaleID = document.querySelector("#scalar");
      scaleID!.textContent = scalar.toFixed(2).toString();

      ctx!.translate(xCoord, yCoord);
      ctx!.scale(zoom, zoom);
      ctx!.translate(-xCoord, -yCoord);
    }
    updateCoords();
    boundCoords();
  }

  //Adjusts zoom according to scroll
  function mouseScroll(evt: React.WheelEvent<HTMLCanvasElement>) {
    const zoomDelta = evt.deltaY < 0 ? 1 + zoomAmount : 1 - zoomAmount;
    zoom(zoomDelta, tfCursor.x, tfCursor.y);
  }

  // initializes canvas variables
  useEffect(() => {
    // Initialize
    if (canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      offset.y = rect.top;
      offset.x = rect.left;
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
  }, [ctx]);

  return (
    <div
      style={
        {
          width: canvasSize.x - offset.x,
          height: canvasSize.y - offset.y,
          overflow: "hidden",
        } as React.CSSProperties
      }
    >
      <button
        className={"zoom-button plus-button"}
        onClick={() => zoom(1 + zoomAmount, centerPos.x, centerPos.y)}
      >
        +
      </button>
      <button className={"zoom-button zoom-amount"}>
        <div id={"scalar"}>{scalar.toFixed(2)}</div>
      </button>
      <button
        className={"zoom-button minus-button"}
        onClick={() => zoom(1 - zoomAmount, centerPos.x, centerPos.y)}
      >
        -
      </button>
      <button
        className={"zoom-button home-button"}
        onClick={() => {
          ctx!.scale(1 / scalar, 1 / scalar);
          scalar *= 1 / scalar;
          updateCoords();
          ctx!.translate(upleftCorner.x, upleftCorner.y);
          updateCoords();
          homePosition();
        }}
      >
        ↺
      </button>
      <button
        className={"zoom-button whole-graph-button"}
        onClick={() => {
          showEdges = !showEdges;
        }}
      >
        O
      </button>
      <canvas
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onMouseDown={mouseDown}
        onWheel={mouseScroll}
        ref={canvasRef}
        width={getWidth()}
        height={getHeight()}
      ></canvas>
    </div>
  );
};
