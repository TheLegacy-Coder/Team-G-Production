import React, { useCallback, useEffect, useRef } from "react";
import { draw } from "../map/Draw";
import { mouse } from "../map/Mouse";
import { algorithm } from "../map/MapAlgorithm.ts";
import { drawData, initCTX } from "../map/DrawData.ts";
import "../components/styles/ZoomButton.css";

export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  initCTX(canvasCtxRef.current);

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
        //redraw = true;
        drawData.setRedraw(true);
      }, 100);
    }
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
          drawData.resetMap();
          mouse.homePosition();
        }}
      >
        ↺
      </button>
      <button
        className={"zoom-button whole-graph-button"}
        onClick={() => {
          draw.toggleEdges();
        }}
      >
        O
      </button>
      <button
        id={"F3"}
        className={"zoom-button third-floor"}
        onClick={() => {
          changeMap("3", "03_thethirdfloor.png");
        }}
      >
        F3
      </button>
      <button
        id={"F2"}
        className={"zoom-button second-floor"}
        onClick={() => {
          changeMap("2", "02_thesecondfloor.png");
        }}
      >
        F2
      </button>
      <button
        id={"F1"}
        className={"zoom-button first-floor"}
        onClick={() => {
          changeMap("1", "01_thefirstfloor.png");
        }}
      >
        F1
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
