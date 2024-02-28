import React, { useCallback, useEffect, useRef } from "react";
import { mouse } from "../map/Mouse";
import { algorithm } from "../map/MapAlgorithm.ts";
import { ctx, drawData, initCTX } from "../map/DrawData.ts";
import { draw } from "../map/Draw";
import { speechEngineBackend } from "../stores/SpeechEngineBackend.ts";
export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  initCTX(canvasCtxRef.current);

  useEffect(() => {
    speechEngineBackend.RegisterCommands({
      commands: [`go to floor 3`, `go to floor three`],
      callback: () => {
        document.getElementById("F3")?.click();
      },
    });

    speechEngineBackend.RegisterCommand({
      command: `go to floor 2`,
      callback: () => {
        document.getElementById("F2")?.click();
      },
    });

    speechEngineBackend.RegisterCommands({
      commands: [`go to floor 1`, `go to floor one`],
      callback: () => {
        document.getElementById("F1")?.click();
      },
    });

    speechEngineBackend.RegisterCommand({
      command: `go to floor L1`,
      callback: () => {
        document.getElementById("L1")?.click();
      },
    });

    speechEngineBackend.RegisterCommand({
      command: `go to floor L2`,
      callback: () => {
        document.getElementById("L2")?.click();
      },
    });
  });

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
    draw;
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
      onTouchStart={mouse.canvasTouchStart}
      onTouchEnd={mouse.canvasTouchEnd}
      onTouchMove={mouse.canvasTouchMove}
      onMouseMove={mouse.mouseMove}
      onWheel={mouse.mouseScroll}
      ref={canvasRef}
      width={window.innerWidth - drawData.offset.x}
      height={window.innerHeight - drawData.offset.y}
    />
  );
};
/* onMouseMove={mouse.mouseMove}
        onMouseUp={mouse.mouseUp}
        onWheel={mouse.mouseScroll}*/
