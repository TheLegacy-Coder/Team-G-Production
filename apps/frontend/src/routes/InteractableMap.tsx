import React, { useEffect, useRef } from "react";
import { AStarSearch, MapNode, mapNodes, nodeStore } from "../map/MapNode.ts";
import "../components/styles/ZoomButton.css";

let imageWidth = 100;
let imageHeight = 100;
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

let showEdges = false;

//Stores scaled map amount
let scalar = 0.75;
//Stores map xy coordinates for translation
let mapX = -1500;
let mapY = -600;
//Stores map delta xy coordinates while panning
let xDelta = 0;
let yDelta = 0;
//Stores the start xy of mouse when pressed
let startX = 0;
let startY = 0;
//Stores whether to update map position if moving
let moveMap = false;

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
    imageWidth = width;
    return width;
  }

  function getHeight(): number {
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    imageHeight = height;
    return height;
  }

  function draw() {
    ctx = canvasCtxRef.current;

    if (ctx == null) {
      return;
    }

    //Stores local scaled variable to avoid getting/setting conflicts
    const scaled = scalar;
    //Stores the width and height of window
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    //Stores amount to translate drawn canvas items
    const transX = mapX + xDelta;
    const transY = mapY + yDelta;
    //Clears canvas
    ctx!.clearRect(0, 0, width, height);
    //Scales canvas for zoom
    ctx!.scale(scaled, scaled);
    drawStep = drawStep - 1 >= 1 ? drawStep - 1 : 50;
    ctx?.drawImage(image, transX, transY);
    if (frames[drawStep] != undefined) {
      frames[drawStep].forEach((frame) => {
        ctx!.beginPath();
        ctx!.arc(
          frame[0] + transX,
          frame[1] + transY,
          5,
          0,
          2 * Math.PI,
          false,
        );
        ctx!.fillStyle = "#0000FF";
        ctx!.fill();
      });
    }

    flip = !flip;

    //if draw edges
    if (showEdges) {
      mapNodes.forEach((node) => {
        // wrap in if
        ctx!.lineWidth = 3;
        ctx!.strokeStyle = "#AAAAAA";
        node.edges.forEach((edge) => {
          // Start a new Path
          ctx!.beginPath();
          ctx!.moveTo(node.xcoord + transX, node.ycoord + transY);
          ctx!.lineTo(edge.xcoord + transX, edge.ycoord + transY);
          // Draw the Path
          ctx!.stroke();
        });
      });
    }

    mapNodes.forEach((node) => {
      ctx!.beginPath();
      ctx!.arc(
        node.xcoord + transX,
        node.ycoord + transY,
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
          node.xcoord - 80 + transX,
          node.ycoord + 15 + transY,
          160,
          20,
        );
        ctx!.strokeRect(
          node.xcoord - 80 + transX,
          node.ycoord + 15 + transY,
          160,
          20,
        );
        ctx!.font = "bold 10pt Courier";
        ctx!.textAlign = "center";
        ctx!.fillStyle = "#550000";
        ctx!.fillText(
          node.shortName,
          node.xcoord + transX,
          node.ycoord + 28 + transY,
        );
      }
    });

    //forceUpdate();

    //Sets image width for display
    imageWidth = width;
    imageHeight = height;
    //Unscales canvas for zoom
    ctx!.scale(1 / scaled, 1 / scaled);
    //console.log(drawStep);
    setTimeout(draw, 15);
  }

  //Draws on canvas when map image loaded
  image.onload = () => {
    draw();
  };

  //Updates map location to be within the bounds of the page
  function updateXY() {
    if (image.width * scalar < imageWidth) {
      //Centers image along x axis
      mapX = (imageWidth - image.width * scalar) / 2 / scalar;
      xDelta = 0;
    } else {
      if (mapX + xDelta >= 0) {
        //Aligns image along left side
        mapX -= mapX + xDelta;
      }
      if (mapX <= imageWidth / scalar - image.width - xDelta - xOffset) {
        //Aligns image along right side
        mapX = imageWidth / scalar - image.width - xDelta - xOffset;
      }
    }
    if (image.height * scalar < imageHeight) {
      //Centers image along y axis
      mapY = (imageHeight - image.height * scalar) / 2 / scalar;
      yDelta = 0;
    } else {
      if (mapY + yDelta >= 0) {
        //Aligns image along top side
        mapY -= mapY + yDelta;
      }
      if (mapY <= (imageHeight - yOffset) / scalar - image.height - yDelta) {
        //Aligns image along bottom side
        mapY = (imageHeight - yOffset) / scalar - image.height - yDelta;
      }
    }
  }

  //Gets the x and y coordinates for mouse hovering and adjusts xy for corner bounds
  function getXY(evt: React.MouseEvent<Element, MouseEvent>): {
    x: number;
    y: number;
  } {
    //Adjust delta values if moving map
    if (moveMap) {
      xDelta = (evt.pageX - startX) / scalar;
      yDelta = (evt.pageY - startY) / scalar;
    }

    updateXY();

    //Returned xy values
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
          // console.log("frames");
          // console.log(frames);
        } else {
          path = [];
          frames = [[[]]];
          sl = node;
          nodeStore.setSelectedNode(sl);
          // console.log("CLEAR");
        }
      }
    });
    if (emptyClick && xDelta == 0 && yDelta == 0) {
      hl = undefined;
      sl = undefined;
      nodeStore.setSelectedNode(sl);
      path = [];
      frames = [[[]]];
    }
    mapX += xDelta;
    mapY += yDelta;
    xDelta = 0;
    yDelta = 0;
    moveMap = false;
  }

  //Starts moving map according to mouse drag
  function mouseDown(evt: React.MouseEvent<Element, MouseEvent>) {
    startX = evt.pageX;
    startY = evt.pageY;
    moveMap = true;
  }

  function mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
    if (ctx == null) return;
    //let changed = moveMap;
    const cord = getXY(evt);
    mapNodes.forEach((node) => {
      const dist = Math.sqrt(
        Math.pow(cord.x - node.xcoord, 2) + Math.pow(cord.y - node.ycoord, 2),
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
  }

  function zoom(zoomIn: boolean) {
    if (zoomIn && scalar < 1.3) {
      //Zooms in
      scalar *= 1.2;
    } else if (!zoomIn && scalar > 0.4) {
      //Zooms out
      scalar *= 1 / 1.2;
    }
    updateXY();
    const scaleID = document.querySelector("#scalar");
    scaleID!.textContent = scalar.toFixed(2).toString();
  }

  //Adjusts zoom according to scroll
  function mouseScroll(evt: React.WheelEvent<HTMLCanvasElement>) {
    if (ctx == null) return;
    const delta = evt.deltaY;

    if (delta < 0) {
      zoom(true);
    } else {
      zoom(false);
    }
  }

  useEffect(() => {
    // Initialize
    if (canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      yOffset = rect.top;

      xOffset = rect.left;
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
  }, [ctx]);

  function toggleEdges() {
    showEdges = !showEdges;
  }

  return (
    <div
      style={
        {
          width: imageWidth - xOffset,
          height: imageHeight - yOffset,
          overflow: "hidden",
        } as React.CSSProperties
      }
    >
      <button className={"zoom-button plus-button"} onClick={() => zoom(true)}>
        +
      </button>
      <button className={"zoom-button zoom-amount"}>
        <div id={"scalar"}>{scalar.toFixed(2)}</div>
      </button>
      <button
        className={"zoom-button minus-button"}
        onClick={() => zoom(false)}
      >
        -
      </button>
      <button
        className={"zoom-button home-button"}
        onClick={() => {
          scalar = 0.75;
          //Stores map xy coordinates for translation
          mapX = -1500;
          mapY = -600;
          const scaleID = document.querySelector("#scalar");
          scaleID!.textContent = scalar.toFixed(2).toString();
        }}
      >
        ↺
      </button>
      <button
        className={"zoom-button whole-graph-button"}
        onClick={toggleEdges}
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
