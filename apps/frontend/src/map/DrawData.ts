import { MapNode } from "./MapNode.ts";

export let floors: string[] = [];
export const pathLowest = { x: 0, y: 0 };
export const pathHighest = { x: 0, y: 0 };

export let currentFloor = "L1";

export let path: MapNode[] = [];

export let frames: number[][][] = [[[]]];

export let redraw = true;

export let scalar = 1;

export const offset = { x: 0, y: 0 };

export const upleftCorner: { x: number; y: number } | undefined = {
  x: 0,
  y: 0,
};

export let downrightCorner: { x: number; y: number } | undefined = {
  x: 0,
  y: 0,
};

export let centerPos: { x: number; y: number } | undefined = { x: 0, y: 0 };

// converts coordinates from page frame to image frame
export function tfPoint(x: number, y: number) {
  if (ctx === null) {
    return undefined;
  }
  const origin = new DOMPoint(x, y);
  return ctx!.getTransform().invertSelf().transformPoint(origin);
}

// updates coordinate points for map panning and zooming
export function updateCoords() {
  centerPos = tfPoint(
    (window.innerWidth - offset.x) / 2,
    (window.innerHeight - offset.y) / 2,
  );
  //upleftCorner = tfPoint(0, 0);
  upleftCorner!.x = tfPoint(0, 0)!.x;
  upleftCorner!.y = tfPoint(0, 0)!.y;
  downrightCorner = tfPoint(window.innerWidth, window.innerHeight);
}

export let image = new Image();
image.src = "00_thelowerlevel1.png";

export let ctx: CanvasRenderingContext2D | null;

export function initCTX(ctxRef: CanvasRenderingContext2D | null) {
  ctx = ctxRef;
}

export function setImage(imageSrc: string) {
  image = new Image();
  image.src = imageSrc;
}

export function setOffset(top: number, left: number) {
  offset.y = top;
  offset.x = left;
}

export function setScalar(value: number) {
  scalar = value;
}

export function setCurrentFloor(value: string) {
  currentFloor = value;
}

export function clearFloors() {
  floors = [];
}

export function resetPath() {
  path = [];
  frames = [[[]]];
}

export function framePush(temp: number[][]) {
  frames.push(temp);
}

export function setRedraw(value: boolean) {
  redraw = value;
}

export function resetMap() {
  //frames = [[[]]];
  resetPath();
  //drawStep = 0;
  ctx!.scale(1 / scalar, 1 / scalar);
  //scalar *= 1 / scalar;
  setScalar(1);
  updateCoords();
  ctx!.translate(upleftCorner!.x, upleftCorner!.y);
  updateCoords();
  //redraw = true;
  setRedraw(true);
}
