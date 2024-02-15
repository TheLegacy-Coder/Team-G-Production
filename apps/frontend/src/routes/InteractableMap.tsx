import React, { useCallback, useEffect, useRef } from "react";
import {
  getWidth,
  getHeight,
  scalar,
  offset,
  toggleEdges,
  zoomAmount,
  initCTX,
  searchAlg,
  image,
  nodePoll,
} from "../map/Draw";
import { currentFloor, resetMap, setMap, homePosition } from "../map/BoundMap";
import {
  mouseScroll,
  mouseMove,
  mouseUp,
  mouseDown,
  zoom,
  centerPos,
} from "../map/Mouse";

export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  initCTX(canvasCtxRef.current);

  // initializes canvas variables
  useEffect(() => {
    // Initialize
    if (canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      offset.y = rect.top;
      offset.x = rect.left;
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
    initCTX(canvasCtxRef.current);
  }, []);

  /*const aStar = */ useCallback(searchAlg, [
    currentFloor,
    image.width,
    image.height,
  ]);

  const poll = useCallback(nodePoll, [searchAlg]);

  useEffect(() => {
    const intervalID = setInterval(poll, 10);
    return () => clearInterval(intervalID);
  }, [poll]);

  return (
    <div
      style={
        {
          width: getWidth() - offset.x,
          height: getHeight() - offset.y,
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
          toggleEdges();
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
