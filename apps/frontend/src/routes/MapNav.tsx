import "./styles/MapNav.css";
import React, { useState, useCallback, useEffect } from "react";
import "../index.css";
import {
  EyeFill,
  EyeSlashFill,
  HouseFill,
  ZoomIn,
  ZoomOut,
} from "react-bootstrap-icons";
import { setHoverNode, mouse } from "../map/Mouse";
import { algorithm } from "../map/MapAlgorithm.ts";
import { PathfindingButton } from "../components/PathfindingButton.tsx";
import { drawData } from "../map/DrawData.ts";
import {
  AStarSearch,
  BreadthFirstSearch,
  DepthFirstSearch,
  DijkstraSearch,
} from "../map/MapNode.ts";

interface Visibility {
  nodes: boolean;
  edges: boolean;
  halls: boolean;
}

export const MapNav = () => {
  const [currentAlg, setCurrentAlg] = useState<string>("BFS");
  const [visibilities, setVisibilities] = useState<Visibility>({
    nodes: drawData.showNodes,
    edges: drawData.showEdges,
    halls: drawData.showHalls,
  });
  const [selectWidth, setSelectWidth] = useState<string>("0px");
  const [selectHeight, setSelectHeight] = useState<string>("0px");

  const ICON_SIZE = 35;

  function changeMap(floor: string, imageSrc: string) {
    setHoverNode(undefined);

    if (mouse.setMap(floor, imageSrc)) {
      algorithm.searchAlg();
      setTimeout(() => {
        drawData.setRedraw(true);
      }, 100);
    }
  }
  function toggleButtons(type: string) {
    if (type === "nodes") {
      drawData.showNodes = !drawData.showNodes;
      setVisibilities({ ...visibilities, nodes: !visibilities.nodes });
    } else if (type === "edges") {
      drawData.showEdges = !drawData.showEdges;
      setVisibilities({ ...visibilities, edges: !visibilities.edges });
    } else if (type === "halls") {
      drawData.showHalls = !drawData.showHalls;
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
    } else if (newAlg === "Dijkstra") {
      algorithm.setSearchStrategy(new DijkstraSearch());
    }
    setCurrentAlg(newAlg);
  }

  interface ToggleButtonProps {
    title: string;
    value: boolean;
    onClick: () => void;
    onChange: () => void;
  }

  //let selectWidth = "";
  //let selectHeight = "";

  const poll = useCallback(() => {
    const styleWidth = window.getComputedStyle(document.documentElement);
    const styleHeight = window.getComputedStyle(document.documentElement);
    const tempWidth = styleWidth.getPropertyValue("--init-width");
    const tempHeight = styleHeight.getPropertyValue("--init-height");
    if (tempWidth !== selectWidth || tempHeight !== selectHeight) {
      setSelectWidth(tempWidth);
      setSelectHeight(tempHeight);
    }
  }, [selectWidth, selectHeight]);

  useEffect(() => {
    const intervalID = setInterval(poll, 10);
    return () => clearInterval(intervalID);
  }, [poll]);

  function getSize() {
    let width = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--init-width");
    let height = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--init-height");
    width = width.substring(0, width.length - 2);
    height = height.substring(0, height.length - 2);
    return Math.min(Number(width), Number(height)) / 1.7;
  }

  function ToggleButton({
    title,
    value,
    onClick,
    onChange,
  }: ToggleButtonProps) {
    return (
      <button
        className={"toggle-button"}
        onClick={onClick}
        onChange={onChange}
        onResize={changed}
        onResizeCapture={changed}
      >
        <div>{title}</div>
        <div style={{ marginLeft: "auto" }}>
          {value ? (
            <EyeFill color="white" size={getSize()} />
          ) : (
            <EyeSlashFill color="white" size={getSize()} />
          )}
        </div>
      </button>
    );
  }
  function selectButton(currentFloor: string) {
    const floor3ID = document.querySelector("#F3");
    const floor2ID = document.querySelector("#F2");
    const floor1ID = document.querySelector("#F1");
    const floorL1ID = document.querySelector("#L1");
    const floorL2ID = document.querySelector("#L2");
    const floorIDs = [floor3ID, floor2ID, floor1ID, floorL1ID, floorL2ID];
    //remove the selected floor class from any floor that has it
    floorIDs.forEach(function (floorID) {
      if (floorID !== null) {
        floorID.classList.remove("selected-floor-button");
        //only add selected floor class if thats the floor that the user is on
        if (document.querySelector("#" + currentFloor) === floorID) {
          floorID.classList.add("selected-floor-button");
        }
      }
    });
  }

  function changed() {
    console.log("Changed");
  }

  return (
    <div
      onMouseMove={mouse.mouseMove}
      onMouseUp={mouse.divMouseUp}
      onTouchStart={mouse.divTouchStart}
    >
      <div className={"map-top-left-buttons"}>
        <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          <div className={"group-buttons"}>
            <button
              className={"group-button"}
              onClick={() => mouse.buttonZoom(true)}
              style={{
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
                borderTopLeftRadius: "16px",
                borderBottomLeftRadius: "16px",
              }}
            >
              <ZoomIn size={ICON_SIZE} />
            </button>
            <button
              className={"group-button"}
              onClick={() => mouse.buttonZoom(false)}
              style={{ borderRadius: "0px" }}
            >
              <ZoomOut size={ICON_SIZE} />
            </button>
            <button
              className={"group-button home-button"}
              onClick={() => {
                drawData.resetMap(false);
                mouse.homePosition(drawData.currentFloor);
              }}
              style={{
                borderTopRightRadius: "16px",
                borderBottomRightRadius: "16px",
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
              }}
            >
              <HouseFill size={ICON_SIZE} />
            </button>
            <button className={"group-button zoom-amount"}>
              <div id={"scalar"}></div>
            </button>
          </div>
        </div>

        <div className={"toggle-button-container"}>
          <ToggleButton
            title={"Nodes"}
            value={visibilities.nodes}
            onClick={() => toggleButtons("nodes")}
            onChange={changed}
          />
          <ToggleButton
            title={"Edges"}
            value={visibilities.edges}
            onClick={() => toggleButtons("edges")}
            onChange={changed}
          />
          <ToggleButton
            title={"Halls"}
            value={visibilities.halls}
            onClick={() => toggleButtons("halls")}
            onChange={changed}
          />
        </div>
      </div>
      <div className={"map-top-left-search-button"}>
        <PathfindingButton
          algorithm={currentAlg}
          handleChange={changeAlgorithm}
        />
      </div>

      <div className={"map-bottom-left-buttons"}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            id={"F3"}
            className={"group-button"}
            onClick={() => {
              selectButton("F3");
              changeMap("3", "03_thethirdfloor.png");
            }}
            style={{
              borderTopRightRadius: "16px",
              borderTopLeftRadius: "16px",
            }}
          >
            3
          </button>
          <button
            id={"F2"}
            className={"group-button"}
            onClick={() => {
              selectButton("F2");
              changeMap("2", "02_thesecondfloor.png");
            }}
          >
            2
          </button>
          <button
            id={"F1"}
            className={"group-button"}
            onClick={() => {
              selectButton("F1");
              changeMap("1", "01_thefirstfloor.png");
            }}
          >
            1
          </button>
          <button
            id={"L1"}
            className={"group-button selected-floor-button"}
            onClick={() => {
              selectButton("L1");
              changeMap("L1", "00_thelowerlevel1.png");
            }}
          >
            L1
          </button>
          <button
            id={"L2"}
            className={"group-button"}
            onClick={() => {
              selectButton("L2");
              changeMap("L2", "00_thelowerlevel2.png");
            }}
            style={{
              borderBottomRightRadius: "16px",
              borderBottomLeftRadius: "16px",
            }}
          >
            L2
          </button>
        </div>
      </div>
    </div>
  );
};
