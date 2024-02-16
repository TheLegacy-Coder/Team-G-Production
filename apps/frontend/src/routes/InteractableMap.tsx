import React, { useCallback, useEffect, useRef } from "react";
import {
  offset,
  toggleEdges,
  initCTX,
  setOffset,
  setRedraw,
} from "../map/Draw";
import { resetMap, setMap, homePosition } from "../map/BoundMap";
import {
  mouseScroll,
  mouseMove,
  mouseUp,
  mouseDown,
  buttonZoom,
} from "../map/Mouse";
import { searchAlg, nodePoll } from "../map/MapAlgorithm.ts";
import "../components/styles/ZoomButton.css";

export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  initCTX(canvasCtxRef.current);

  const imageWidth = 5000;
  const imageHeight = 3400;

  // initializes canvas variables
  useEffect(() => {
    // Initialize
    if (canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      setOffset(rect.top, rect.left);
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
    initCTX(canvasCtxRef.current);
  }, []);

  /*const aStar = */ useCallback(searchAlg, [imageWidth, imageHeight]);

  const poll = useCallback(nodePoll, [searchAlg]);

  useEffect(() => {
    const intervalID = setInterval(poll, 10);
    return () => clearInterval(intervalID);
  }, [poll]);

  function changeMap(floor: string, imageSrc: string) {
    if (setMap(floor, imageSrc)) {
      searchAlg();
      setTimeout(() => {
        //redraw = true;
        setRedraw();
      }, 100);
    }
  }

  return (
    <div
      style={
        {
          width: window.innerWidth - offset.x,
          height: window.innerHeight - offset.y,
          overflow: "hidden",
        } as React.CSSProperties
      }
    >
      <button
        className={"zoom-button plus-button"}
        onClick={() => buttonZoom(true)}
      >
        +
      </button>
      <button className={"zoom-button zoom-amount"}>
        <div id={"scalar"}></div>
      </button>
      <button
        className={"zoom-button minus-button"}
        onClick={() => buttonZoom(false)}
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
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onMouseDown={mouseDown}
        onWheel={mouseScroll}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
};
