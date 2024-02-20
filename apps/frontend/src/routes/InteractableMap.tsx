import React, { useCallback, useEffect, useRef, useState } from "react";
import { draw } from "../map/Draw";
import { mouse } from "../map/Mouse";
import { algorithm } from "../map/MapAlgorithm.ts";
import { drawData, initCTX } from "../map/DrawData.ts";
import "../components/styles/ZoomButton.css";
import { PathfindingButton } from "../components/PathfindingButton.tsx";
import {
  AStarSearch,
  BreadthFirstSearch,
  DepthFirstSearch,
} from "../map/MapNode.ts";

export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  initCTX(canvasCtxRef.current);
  const [currentAlg, setCurrentAlg] = useState<string>("BFS");

  function initContext() {
    if (canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      drawData.setOffset(rect.top, rect.left);
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
    initCTX(canvasCtxRef.current);
    drawData.setRedraw(true);
  }
  // initializes canvas variables
  useEffect(() => {
    initContext();
  }, []);

  useCallback(() => {
    algorithm.searchAlg();
  }, []);

  const poll = useCallback(() => {
    algorithm.nodePoll();
  }, []);

  useEffect(() => {
    const intervalID = setInterval(poll, 10);
    return () => clearInterval(intervalID);
  }, [poll]);

  function changeMap(floor: string, imageSrc: string) {
    if (mouse.setMap(floor, imageSrc)) {
      algorithm.searchAlg();
      setTimeout(() => {
        drawData.setRedraw(true);
      }, 100);
    }
  }

  function toggleButtons(id: string) {
    const toggle = document.getElementById(id) as HTMLInputElement;
    if (id === "nodes") {
      draw.showNodes = toggle.checked;
    } else if (id === "edges") {
      draw.showEdges = toggle.checked;
    } else if (id === "halls") {
      draw.showHalls = toggle.checked;
    }
    drawData.setRedraw(true);
  }

  function changeAlgorithm(newAlg: string) {
    if (newAlg === "BFS") {
      algorithm.setSearchStrategy(new BreadthFirstSearch());
    } else if (newAlg === "A*") {
      algorithm.setSearchStrategy(new AStarSearch());
    } else if (newAlg === "DFS") {
      algorithm.setSearchStrategy(new DepthFirstSearch());
    }
    setCurrentAlg(newAlg);
  }

  return (
    <div
      style={
        {
          width: window.innerWidth - drawData.offset.x,
          height: window.innerHeight - drawData.offset.y,
          overflow: "hidden",
        } as React.CSSProperties
      }
    >
      <button
        className={"zoom-button plus-button"}
        onClick={() => mouse.buttonZoom(true)}
      >
        +
      </button>
      <button className={"zoom-button zoom-amount"}>
        <div id={"scalar"}></div>
      </button>
      <button
        className={"zoom-button minus-button"}
        onClick={() => mouse.buttonZoom(false)}
      >
        -
      </button>
      <button
        className={"zoom-button home-button"}
        onClick={() => {
          drawData.resetMap(false);
          mouse.homePosition();
        }}
      >
        ↺
      </button>
      <label className={"toggle-button"}>
        <input
          type="checkbox"
          id={"nodes"}
          defaultChecked={draw.showNodes}
          onChange={() => {
            toggleButtons("nodes");
          }}
        />
        <span className={"toggle-nodes"}></span>
        <p className={"toggle-nodes-text"}>Toggle Nodes</p>
      </label>
      <label className={"toggle-button trans-edges"}>
        <input
          type="checkbox"
          id={"edges"}
          defaultChecked={draw.showEdges}
          onChange={() => {
            toggleButtons("edges");
          }}
        />
        <span className={"toggle-nodes"}></span>
        <p className={"toggle-nodes-text"}>Toggle Edges</p>
      </label>
      <label className={"toggle-button trans-halls"}>
        <input
          type="checkbox"
          id={"halls"}
          defaultChecked={draw.showHalls}
          onChange={() => {
            toggleButtons("halls");
          }}
        />
        <span className={"toggle-nodes"}></span>
        <p className={"toggle-nodes-text"}>Toggle Halls</p>
      </label>
      <button
        id={"F3"}
        className={"zoom-button third-floor"}
        onClick={() => {
          changeMap("3", "03_thethirdfloor.png");
        }}
      >
        3
      </button>
      <button
        id={"F2"}
        className={"zoom-button second-floor"}
        onClick={() => {
          changeMap("2", "02_thesecondfloor.png");
        }}
      >
        2
      </button>
      <button
        id={"F1"}
        className={"zoom-button first-floor"}
        onClick={() => {
          changeMap("1", "01_thefirstfloor.png");
        }}
      >
        1
      </button>
      <button
        id={"L1"}
        className={"zoom-button lower-floor"}
        onClick={() => {
          changeMap("L1", "00_thelowerlevel1.png");
        }}
      >
        L1
      </button>
      <button
        id={"L2"}
        className={"zoom-button lowest-floor"}
        onClick={() => {
          changeMap("L2", "00_thelowerlevel2.png");
        }}
      >
        L2
      </button>
      <PathfindingButton
        algorithm={currentAlg}
        handleChange={changeAlgorithm}
      />
      <canvas
        onMouseMove={mouse.mouseMove}
        onMouseUp={mouse.mouseUp}
        onMouseDown={mouse.mouseDown}
        onWheel={mouse.mouseScroll}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
};
