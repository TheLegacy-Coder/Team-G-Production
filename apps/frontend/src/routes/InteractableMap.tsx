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
} from "../map/MapNode.ts";
import "../components/styles/ZoomButton.css";

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

let showDetail = false;

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

  const image = new Image();
  image.src = "00_thelowerlevel1.png";
  let currenFloor = "L1";

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
        if (node.floor === currenFloor) {
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
      if (node.floor === currenFloor) {
        if (
          node !== startNode &&
          node !== endNode &&
          node !== hoverNode &&
          showDetail
        ) {
          drawNodeDetails(node);
        }
      }
    });

    for (let i = 0; i < 2; i++) {
      let node: MapNode | undefined = undefined;
      if (i === 0 && startNode !== undefined) node = startNode;
      else if (i === 1 && endNode !== undefined) node = endNode;
      if (node !== undefined) drawNodeDetails(node);
    }

    mapNodes.forEach((node) => {
      if (node.floor === currenFloor) {
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

    setTimeout(draw, 15);
  }

  function drawNodeDetails(node: MapNode) {
    if (node.floor === currenFloor) {
      ctx!.fillStyle = "#FFFFFF";
      ctx!.strokeStyle = "#000000";
      ctx!.lineWidth = 5 / scalar;
      ctx!.fillRect(
        node.xcoord - 80 / scalar,
        node.ycoord + 15,
        160 / scalar,
        20 / scalar,
      );
      ctx!.strokeRect(
        node.xcoord - 80 / scalar,
        node.ycoord + 15,
        160 / scalar,
        20 / scalar,
      );
      ctx!.font = "bold " + (10 / scalar).toString() + "pt Courier";
      ctx!.textAlign = "center";
      ctx!.fillStyle = "#550000";
      ctx!.fillText(
        node.shortName,
        node.xcoord,
        node.ycoord + 15 + 13 / scalar,
      );
    }
  }

  //Draws on canvas when map image loaded
  image.onload = () => {
    draw();
    homePosition();
  };

  const poll = useCallback(() => {
    startNode = getStartNode();
    endNode = getEndNode();
    if (startNode !== undefined && endNode !== undefined) {
      nodeStore.setSelectedNode(startNode);
      path = [];
      frames = [[[]]];
      aStar();
    }
  }, []);

  useEffect(() => {
    const intervalID = setInterval(poll, 10);
    return () => clearInterval(intervalID);
  }, [poll]);

  function aStar() {
    path = AStarSearch(startNode, endNode);
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
  }

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

  // runs when mouse reeased
  function mouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
    if (tfCursor === undefined || delta === undefined) {
      return null;
    }
    moveMap = false;
    evt.pageX;
    let emptyClick = true;
    mapNodes.forEach((node) => {
      if (node.floor === currenFloor) {
        const dist = Math.sqrt(
          Math.pow(tfCursor!.x - node.xcoord, 2) +
            Math.pow(tfCursor!.y - node.ycoord, 2),
        );
        if (dist < 10) {
          emptyClick = false;
          if (startNode != undefined && path.length == 0) {
            nodeStore.setSelectedNode(startNode);
            setEndNode(node);
            aStar();
          } else {
            path = [];
            frames = [[[]]];
            setStartNode(node);
            //sl = node;
            nodeStore.setSelectedNode(startNode);
          }
        }
      }
    });
    if (emptyClick && delta.x == 0 && delta.y == 0) {
      setStartNode(undefined);
      setEndNode(undefined);
      nodeStore.setSelectedNode(startNode);
      path = [];
      frames = [[[]]];
    }
    delta.x = 0;
    delta.y = 0;
    boundCoords();
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
    tfCursor = tfPoint(evt.pageX - offset.x, evt.pageY - offset.y);

    if (
      delta === undefined ||
      tfCursor === undefined ||
      startPos === undefined
    ) {
      return null;
    }

    if (moveMap) {
      delta.x = evt.pageX - pageStart!.x;
      delta.y = evt.pageY - pageStart!.y;
      ctx!.translate(
        tfCursor.x + offset.x / scalar - startPos.x,
        tfCursor.y + offset.y / scalar - startPos.y,
      );
    }
    mapNodes.forEach((node) => {
      if (node.floor === currenFloor) {
        const dist = Math.sqrt(
          Math.pow(tfCursor!.x - node.xcoord, 2) +
            Math.pow(tfCursor!.y - node.ycoord, 2),
        );
        if (dist < 10) {
          hoverNode = node;
          //changed = true;
        } else {
          if (hoverNode == node) {
            //changed = true;
            hoverNode = undefined;
          }
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
    if (tfCursor === undefined) {
      return null;
    }
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

  function resetMap() {
    ctx!.scale(1 / scalar, 1 / scalar);
    scalar *= 1 / scalar;
    updateCoords();
    ctx!.translate(upleftCorner!.x, upleftCorner!.y);
    updateCoords();
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
        }}
      >
        O
      </button>
      <button
        className={"zoom-button show-detail-button"}
        onClick={() => {
          showDetail = !showDetail;
        }}
      >
        X
      </button>
      <button
        className={"zoom-button third-floor"}
        onClick={() => {
          resetMap();
          currenFloor = "3";
          image.src = "03_thethirdfloor.png";
        }}
      >
        F3
      </button>
      <button
        className={"zoom-button second-floor"}
        onClick={() => {
          resetMap();
          currenFloor = "2";
          image.src = "02_thesecondfloor.png";
        }}
      >
        F2
      </button>
      <button
        className={"zoom-button first-floor"}
        onClick={() => {
          resetMap();
          currenFloor = "1";
          image.src = "01_thefirstfloor.png";
        }}
      >
        F1
      </button>
      <button
        className={"zoom-button lower-floor"}
        onClick={() => {
          resetMap();
          currenFloor = "L1";
          image.src = "00_thelowerlevel1.png";
        }}
      >
        L1
      </button>
      <button
        className={"zoom-button lowest-floor"}
        onClick={() => {
          resetMap();
          currenFloor = "L2";
          image.src = "00_thelowerlevel2.png";
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
