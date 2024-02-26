import React, { useCallback, useEffect, useRef /*, useState*/ } from "react";
import { mouse } from "../map/Mouse";
import { algorithm } from "../map/MapAlgorithm.ts";
import { ctx, drawData, initCTX } from "../map/DrawData.ts";
import "../components/styles/ZoomButton.css";
//import {MapNav} from "./MapNav.tsx";
export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  initCTX(canvasCtxRef.current);

  window.onresize = () => {
    const canvasContainer = document.getElementById("canvas-container")!.style;
    canvasContainer.width =
      (window.innerWidth - drawData.offset.x).toString() + "px";
    canvasContainer.height =
      (window.innerHeight - drawData.offset.y).toString() + "px";
    drawData.resetMap(false);
    ctx!.canvas.width = window.innerWidth - drawData.offset.x;
    ctx!.canvas.height = window.innerHeight - drawData.offset.y;
    mouse.homePosition(drawData.currentFloor);
    drawData.setRedraw(true);
  };

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

  return (
    <canvas
      id={"map-canvas"}
      onMouseDown={mouse.mouseDown}
      onMouseUp={mouse.mouseUp}
      onTouchStart={(evt) => {
        mouse.canvasTouchStart(evt);
      }}
      onTouchEnd={(evt) => {
        mouse.canvasTouchEnd(evt);
      }}
      onTouchMove={(evt) => {
        mouse.canvasTouchMove(evt);
      }}
      onMouseMove={mouse.mouseMove}
      onWheel={mouse.mouseScroll}
      ref={canvasRef}
      width={window.innerWidth - drawData.offset.x}
      height={window.innerHeight - drawData.offset.y}
    />
  );
};
