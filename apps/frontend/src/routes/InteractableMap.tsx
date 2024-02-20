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
import { Dash, EyeFill, EyeSlashFill, Plus } from "react-bootstrap-icons";

interface Visibility {
  nodes: boolean;
  edges: boolean;
  halls: boolean;
}

export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  initCTX(canvasCtxRef.current);
  const [currentAlg, setCurrentAlg] = useState<string>("BFS");
  const [visibilities, setVisibilities] = useState<Visibility>({
    nodes: draw.showNodes,
    edges: draw.showEdges,
    halls: draw.showHalls,
  });
  const [floor, setFloor] = useState<string>(drawData.currentFloor);

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
      setFloor(floor);
      algorithm.searchAlg();
      setTimeout(() => {
        drawData.setRedraw(true);
      }, 100);
    }
  }

  function toggleButtons(type: string) {
    if (type === "nodes") {
      draw.showNodes = !draw.showNodes;
      setVisibilities({ ...visibilities, nodes: !visibilities.nodes });
    } else if (type === "edges") {
      draw.showEdges = !draw.showEdges;
      setVisibilities({ ...visibilities, edges: !visibilities.edges });
    } else if (type === "halls") {
      draw.showHalls = !draw.showHalls;
      setVisibilities({ ...visibilities, halls: !visibilities.halls });
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

  interface ToggleButtonProps {
    title: string;
    value: boolean;
    onClick: () => void;
  }
  function ToggleButton({ title, value, onClick }: ToggleButtonProps) {
    return (
      <button className={"toggle-button"} onClick={onClick}>
        <div>{title}</div>
        <div style={{ marginLeft: "auto" }}>
          {value ? (
            <EyeFill color="white" size={25} />
          ) : (
            <EyeSlashFill color="white" size={25} />
          )}
        </div>
      </button>
    );
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
      <div className={"map-top-left-buttons"}>
        <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <div className={"zoom-buttons"}>
            <button
              className={"zoom-button"}
              onClick={() => mouse.buttonZoom(false)}
              style={{
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
                borderTopLeftRadius: "16px",
                borderBottomLeftRadius: "16px",
              }}
            >
              <Dash size={30} />
            </button>
            <button
              className={"zoom-button home-button"}
              onClick={() => {
                drawData.resetMap(false);
                mouse.homePosition();
              }}
              style={{ borderRadius: "0px" }}
            >
              ↺
            </button>
            <button className={"zoom-button zoom-amount"}>
              <div id={"scalar"}></div>
            </button>
            <button
              className={"zoom-button"}
              onClick={() => mouse.buttonZoom(true)}
              style={{
                borderTopRightRadius: "16px",
                borderBottomRightRadius: "16px",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
              }}
            >
              <Plus size={30} />
            </button>
          </div>
          <PathfindingButton
            algorithm={currentAlg}
            handleChange={changeAlgorithm}
          />
        </div>

        <div className={"toggle-button-container"}>
          <ToggleButton
            title={"Nodes"}
            value={visibilities.nodes}
            onClick={() => toggleButtons("nodes")}
          />
          <ToggleButton
            title={"Edges"}
            value={visibilities.edges}
            onClick={() => toggleButtons("edges")}
          />
          <ToggleButton
            title={"Halls"}
            value={visibilities.halls}
            onClick={() => toggleButtons("halls")}
          />
        </div>
      </div>

      <div className={"map-bottom-left-buttons"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            id={"F3"}
            className={"zoom-button"}
            onClick={() => {
              changeMap("3", "03_thethirdfloor.png");
            }}
          >
            3
          </button>
          <button
            id={"F2"}
            className={"zoom-button"}
            onClick={() => {
              changeMap("2", "02_thesecondfloor.png");
            }}
          >
            2
          </button>
          <button
            id={"F1"}
            className={"zoom-button"}
            onClick={() => {
              changeMap("1", "01_thefirstfloor.png");
            }}
          >
            1
          </button>
          <button
            id={"L1"}
            className={"zoom-button"}
            onClick={() => {
              changeMap("L1", "00_thelowerlevel1.png");
            }}
          >
            L1
          </button>
          <button
            id={"L2"}
            className={"zoom-button"}
            onClick={() => {
              changeMap("L2", "00_thelowerlevel2.png");
            }}
          >
            L2
          </button>
        </div>
        <h1 style={{ marginTop: "auto" }}>Floor {floor}</h1>
      </div>
      <canvas
        onMouseMove={mouse.mouseMove}
        onMouseUp={mouse.mouseUp}
        onMouseDown={mouse.mouseDown}
        onWheel={mouse.mouseScroll}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};
