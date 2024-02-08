import React, { useEffect, useRef } from "react";
//import { AStarSearch, MapNode, mapNodes, nodeStore } from "../map/MapNode.ts";
import "../components/styles/ZoomButton.css";

 
let canvasWidth = 100;
 
let canvasHeight = 100;
let yOffset = 0;
let xOffset = 0;

const zoomAmount = 1.2;

//Stores scaled map amount
let scale = 1.0;
//Stores map xy coordinates for translation
let mapX = 0;
let mapY = 0;
//Stores map delta xy coordinates while panning
 
let xDelta = 0;
 
let yDelta = 0;
//Stores the start xy of mouse when pressed
let startX = 0;
let startY = 0;
//Stores whether to update map position if moving
let moveMap = false;

export const InteractableMap = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  let ctx = canvasCtxRef.current;

  const image = new Image();
  image.src = "00_thelowerlevel1.png";

  function getWidth(): number {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    canvasWidth = width;
    return width;
  }

  function getHeight(): number {
    const height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    canvasHeight = height;
    return height;
  }

  function draw() {
    ctx = canvasCtxRef.current;
    if (ctx == null) {
      return;
    }
    const transX = mapX + xDelta;
    const transY = mapY + yDelta;
    ctx!.clearRect(0, 0, 5000, 3800);
    ctx!.scale(scale, scale);
    ctx!.drawImage(image, transX, transY);
    ctx!.scale(1 / scale, 1 / scale);

    setTimeout(() => {
      draw();
    }, 15);
  }

  useEffect(() => {
    // Initialize
    if (canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      yOffset = rect.top;

      xOffset = rect.left;
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
  }, [ctx]);

  image.onload = () => {
    draw();
  };

  function updateXY() {
    if (image.width * scale < canvasWidth) {
      //Centers image along x axis
      mapX = (canvasWidth - image.width * scale) / 2 / scale;
      xDelta = 0;
    } else {
      if (mapX + xDelta >= 0) {
        //Aligns image along left side
        mapX -= mapX + xDelta;
      }
      if (mapX <= canvasWidth / scale - image.width - xDelta - xOffset) {
        //Aligns image along right side
        mapX = canvasWidth / scale - image.width - xDelta - xOffset;
      }
    }
    if (image.height * scale < canvasHeight) {
      //Centers image along y axis
      mapY = (canvasHeight - image.height * scale) / 2 / scale;
      yDelta = 0;
    } else {
      if (mapY + yDelta >= 0) {
        //Aligns image along top side
        mapY -= mapY + yDelta;
      }
      if (mapY <= (canvasHeight - yOffset) / scale - image.height - yDelta) {
        //Aligns image along bottom side
        mapY = (canvasHeight - yOffset) / scale - image.height - yDelta;
      }
    }
  }

  function zoom(zoomIn: boolean, mX: number, mY: number) {
    if (zoomIn && scale < 1.3) {
      //Zooms in

      // works when zooming from scale 1
      /*let prevScale = scale;
            scale *= zoomAmount;
            let scaled = 1 + scale - prevScale;
            const mouseX = mX - xOffset;
            const mouseY = mY - yOffset;
            mapX = mouseX / scaled - mouseX + mapX;
            mapY = mouseY / scaled - mouseY + mapY;*/

      const prevScale = scale;
      scale *= zoomAmount;
      const scaled = 1 + scale - prevScale;
      const mouseX = mX - xOffset;
      const mouseY = mY - yOffset;
      mapX = mouseX / scaled - mouseX + mapX / prevScale;
      mapY = mouseY / scaled - mouseY + mapY / prevScale;
    } else if (!zoomIn && scale > 0.4) {
      //Zooms out

      // works when zooming to scale of 1
      /*let prevScale = scale;
            scale *= 1 / zoomAmount;
            let scaled = 1 - scale + prevScale;
            const mouseX = mX - xOffset;
            const mouseY = mY - yOffset;
            mapX = -mouseX / scaled + mouseX + mapX;
            mapY = -mouseY / scaled + mouseY + mapY;*/

      const prevScale = scale;
      scale *= 1 / zoomAmount;
      const scaled = 1 - scale + prevScale;
      const mouseX = mX - xOffset;
      const mouseY = mY - yOffset;
      mapX = -mouseX / scaled + mouseX + mapX;
      mapY = -mouseY / scaled + mouseY + mapY;
    }
    updateXY();
    //const scaleID = document.querySelector("#scalar");
    //scaleID!.textContent = scale.toFixed(2).toString();
  }

  function mouseScroll(evt: React.WheelEvent<HTMLCanvasElement>) {
    const delta = evt.deltaY;

    if (delta < 0) {
      zoom(true, evt.pageX, evt.pageY);
    } else {
      zoom(false, evt.pageX, evt.pageY);
    }
  }

  function getXY(evt: React.MouseEvent<Element, MouseEvent>): {
    x: number;
    y: number;
  } {
    //Adjust delta values if moving map
    if (moveMap) {
      xDelta = (evt.pageX - startX) / scale;
      yDelta = (evt.pageY - startY) / scale;
    }

    updateXY();

    //Returned xy values
    const x = (evt.pageX - xOffset) / scale - mapX;
    const y = (evt.pageY - yOffset) / scale - mapY;

    return { x, y };
  }

  function mouseMove(evt: React.MouseEvent<Element, MouseEvent>) {
    getXY(evt);
  }

  function mouseDown(evt: React.MouseEvent<Element, MouseEvent>) {
    startX = evt.pageX;
    startY = evt.pageY;
    moveMap = true;
  }

  function mouseUp(evt: React.MouseEvent<Element, MouseEvent>) {
    getXY(evt);
    mapX += xDelta;
    mapY += yDelta;
    xDelta = 0;
    yDelta = 0;
    moveMap = false;
  }

  return (
    <div
      style={
        {
          width: canvasWidth - xOffset,
          height: canvasHeight - yOffset,
          overflow: "hidden",
        } as React.CSSProperties
      }
    >
      <canvas
        onWheel={mouseScroll}
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onMouseDown={mouseDown}
        ref={canvasRef}
        width={getWidth()}
        height={getHeight()}
      ></canvas>
    </div>
  );
};
