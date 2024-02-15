import React, { useCallback, useEffect, useRef } from "react";
import {
  setStartNode,
  setEndNode,
  getEndNode,
  getStartNode,
  AStarSearch,
  MapNode,
  mapNodes,
  nodeStore,
  mapEdges,
} from "../map/MapNode.ts";
import "../components/styles/ZoomButton.css";

/**
 * Issues to fix
 * redrawing when path offscreen
 */

const canvasSize = { x: 0, y: 0 };
const offset = { x: 0, y: 0 };

let startNode: MapNode | undefined = undefined;
let endNode: MapNode | undefined = undefined;
let hoverNode: MapNode | undefined = undefined;
let path: MapNode[] = [];

let totalDistance = 0;
let steps: number[] = [];
let drawStep = 0;
let frames: number[][][] = [[[]]];
const spacing = 50;

let showEdges = false;
let newMap = true;
let redraw = true;
let floors: string[] = [];

let pathLowest = { x: 0, y: 0 };
let pathHighest = { x: 0, y: 0 };

//Stores scaled map amount
let scalar = 1;
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
let centerPos: { x: number; y: number } | undefined = { x: 0, y: 0 };
let upleftCorner: { x: number; y: number } | undefined = { x: 0, y: 0 };
let downrightCorner: { x: number; y: number } | undefined = { x: 0, y: 0 };

const zoomAmount = 0.1;

export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  let ctx = canvasCtxRef.current;

  let image = new Image();
  image.src = "00_thelowerlevel1.png";
  let currentFloor = "L1";

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
    if (ctx === null) {
      return undefined;
    }
    const origin = new DOMPoint(x, y);
    return ctx!.getTransform().invertSelf().transformPoint(origin);
  }

  function draw() {
    if (redraw) {
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
        console.log(frames);
      }

      mapNodes.forEach((node) => {
        if (node.floor === currentFloor) {
          ctx!.beginPath();
          ctx!.arc(node.xcoord, node.ycoord, 10, 0, 2 * Math.PI, false);
          ctx!.fillStyle =
            startNode == node
              ? "#00FF00"
              : endNode == node
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
      console.log(
        "Here are the floors: " +
          floors +
          " here is the current floor: " +
          currentFloor +
          " evaluation: " +
          floors.includes(currentFloor),
      );

      let pathInView = false;
      if (
        pathHighest.x > upleftCorner!.x &&
        pathLowest.x < downrightCorner!.x &&
        pathHighest.y > upleftCorner!.y &&
        pathLowest.y < downrightCorner!.y
      ) {
        pathInView = true;
      }

      let currentSelectedFloor = currentFloor;
      if (currentSelectedFloor.length == 1) {
        currentSelectedFloor = "F" + currentSelectedFloor;
      }
      if (
        startNode === undefined ||
        endNode === undefined ||
        !floors.includes(currentSelectedFloor) ||
        !pathInView
      )
        redraw = false;
      console.log("redraw map");
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
      console.log("on load calling redrawing");
      redraw = true;
    }, 25);
  };

  const aStar = useCallback(() => {
    // filters path not on floor
    const unfilteredPath = AStarSearch(startNode, endNode);

    floors = [];

    pathLowest = { x: image.width, y: image.height };
    pathHighest = { x: 0, y: 0 };

    unfilteredPath.forEach((node) => {
      if (node.floor === currentFloor) path.push(node);
      if (!floors.includes(node.floor)) floors.push(node.floor);
    });

    for (let i = 0; i < floors.length; i++) {
      if (floors[i].length === 1) floors[i] = "F" + floors[i];
      const scaleID = document.querySelector("#" + floors[i]);
      scaleID!.classList.add("path-floor");
    }

    totalDistance = 0;
    steps = [0];
    let last: MapNode | undefined = undefined;
    // gets distance based on connected nodes
    path.forEach((node) => {
      if (last != undefined /* && node.edges.includes(last)*/) {
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
        if (s + 1 < path.length && path[s + 1].edges.includes(path[s])) {
          const angleRadians = Math.atan2(
            path[s].ycoord - path[s + 1].ycoord,
            path[s].xcoord - path[s + 1].xcoord,
          );
          const x = path[s].xcoord - Math.cos(angleRadians) * prog;
          const y = path[s].ycoord - Math.sin(angleRadians) * prog;
          temp.push([x, y]);
          if (x < pathLowest.x) pathLowest.x = x;
          else if (x > pathHighest.x) pathHighest.x = x;
          if (y < pathLowest.y) pathLowest.y = y;
          else if (y > pathHighest.y) pathHighest.y = y;
        }
      }
      frames.push(temp);
    }
    console.log("astar calling redrawing");
    redraw = true;
  }, [currentFloor, image.width, image.height]);

  const poll = useCallback(() => {
    const prevStart = startNode;
    const prevEnd = endNode;
    startNode = getStartNode();
    endNode = getEndNode();
    if (prevStart !== startNode || prevEnd !== endNode) {
      const floorNames: string[] = ["F3", "F2", "F1", "L1", "L2"];
      for (let i = 0; i < floorNames.length; i++) {
        const scaleID = document.querySelector("#" + floorNames[i]);
        if (scaleID !== null) scaleID!.classList.remove("path-floor");
      }
      floors = [];
      path.forEach((node) => {
        if (!floors.includes(node.floor)) floors.push(node.floor);
      });
      for (let i = 0; i < floors.length; i++) {
        if (floors[i].length === 1) floors[i] = "F" + floors[i];
        const scaleID = document.querySelector("#" + floors[i]);
        scaleID!.classList.add("path-floor");
      }
    }

    /*floors = [];
    path.forEach((node) => {
      if (!floors.includes(node.floor)) floors.push(node.floor);
    });
    for (let i = 0; i < floors.length; i++) {
      if (floors[i].length === 1) floors[i] = "F" + floors[i];
      const scaleID = document.querySelector("#" + floors[i]);
      scaleID!.classList.add("path-floor");
    }*/

    if (
      startNode !== undefined &&
      endNode !== undefined &&
      (prevStart !== startNode || prevEnd !== endNode)
    ) {
      path = [];
      frames = [[[]]];
      aStar();
    }
  }, [aStar]);

  useEffect(() => {
    const intervalID = setInterval(poll, 10);
    return () => clearInterval(intervalID);
  }, [poll]);

  // resets map position to a default position
  function homePosition() {
    if (ctx === null) {
      return;
    }
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
    if (downrightCorner === undefined || upleftCorner === undefined)
      return null;
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

  // runs when mouse released
  function mouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
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
            aStar();
          } else {
            path = [];
            frames = [[[]]];
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
      path = [];
      frames = [[[]]];
    }
    delta.x = 0;
    delta.y = 0;
    boundCoords();
    redraw = true;
    console.log("mouse up calling redrawing");
  }

  //Starts moving map according to mouse drag
  function mouseDown(evt: React.MouseEvent<Element, MouseEvent>) {
    if (pageStart === undefined) {
      return null;
    }
    pageStart.x = evt.pageX;
    pageStart.y = evt.pageY;
    moveMap = true;
    startPos = tfPoint(evt.pageX, evt.pageY);
    boundCoords();
  }

  // runs for moving mouse
  function mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
    let moveRedraw = false;
    tfCursor = tfPoint(evt.pageX - offset.x, evt.pageY - offset.y);

    if (
      delta === undefined ||
      tfCursor === undefined ||
      startPos === undefined
    ) {
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
          hoverNode = node;
        } else if (hoverNode == node) {
          hoverNode = undefined;
          moveRedraw = true;
        }
      }
    });
    updateCoords();
    boundCoords();
    if (moveRedraw) {
      console.log("move redrawing calling redrawing");
      redraw = true;
    }
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
    console.log("zoom calling redrawing");
    redraw = true;
  }

  //Adjusts zoom according to scroll
  function mouseScroll(evt: React.WheelEvent<HTMLCanvasElement>) {
    if (tfCursor === undefined) {
      return null;
    }
    const zoomDelta = evt.deltaY < 0 ? 1 + zoomAmount : 1 - zoomAmount;
    zoom(zoomDelta, tfCursor.x, tfCursor.y);
    console.log("scrolling calling redrawing");
    redraw = true;
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

  function resetMap() {
    frames = [[[]]];
    drawStep = 0;
    ctx!.scale(1 / scalar, 1 / scalar);
    scalar *= 1 / scalar;
    updateCoords();
    ctx!.translate(upleftCorner!.x, upleftCorner!.y);
    updateCoords();
    redraw = true;
    console.log("reset map calling redrawing");
  }

  function setMap(floor: string, imageSrc: string) {
    if (newMap) {
      newMap = false;
      const tempScalar = scalar;
      ctx!.save();
      resetMap();
      currentFloor = floor;
      image = new Image();
      image.src = imageSrc;
      homePosition();
      newMap = true;
      ctx!.restore();
      scalar = tempScalar;
      const scaleID = document.querySelector("#scalar");
      scaleID!.textContent = scalar.toFixed(2).toString();
      path = [];
      frames = [[[]]];
      aStar();
    }
    setTimeout(() => {
      console.log("set map calling redrawing");
      redraw = true;
    }, 25);
  }

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
        onClick={() => zoom(1 + zoomAmount, centerPos!.x, centerPos!.y)}
      >
        +
      </button>
      <button className={"zoom-button zoom-amount"}>
        <div id={"scalar"}>{scalar.toFixed(2)}</div>
      </button>
      <button
        className={"zoom-button minus-button"}
        onClick={() => zoom(1 - zoomAmount, centerPos!.x, centerPos!.y)}
      >
        -
      </button>
      <button
        className={"zoom-button home-button"}
        onClick={() => {
          resetMap();
          homePosition();
        }}
      >
        ↺
      </button>
      <button
        className={"zoom-button whole-graph-button"}
        onClick={() => {
          showEdges = !showEdges;
          console.log("edges calling redrawing");
          redraw = true;
        }}
      >
        O
      </button>
      <button
        id={"F3"}
        className={"zoom-button third-floor"}
        onClick={() => {
          setMap("3", "03_thethirdfloor.png");
        }}
      >
        F3
      </button>
      <button
        id={"F2"}
        className={"zoom-button second-floor"}
        onClick={() => {
          setMap("2", "02_thesecondfloor.png");
        }}
      >
        F2
      </button>
      <button
        id={"F1"}
        className={"zoom-button first-floor"}
        onClick={() => {
          setMap("1", "01_thefirstfloor.png");
        }}
      >
        F1
      </button>
      <button
        id={"L1"}
        className={"zoom-button lower-floor"}
        onClick={() => {
          setMap("L1", "00_thelowerlevel1.png");
        }}
      >
        L1
      </button>
      <button
        id={"L2"}
        className={"zoom-button lowest-floor"}
        onClick={() => {
          setMap("L2", "00_thelowerlevel2.png");
        }}
      >
        L2
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
