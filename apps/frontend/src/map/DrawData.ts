import { MapNode } from "./MapNode.ts";

export let ctx: CanvasRenderingContext2D | null;

export function initCTX(ctxRef: CanvasRenderingContext2D | null) {
  ctx = ctxRef;
}

class DrawData {
  public floors: string[] = [];
  public pathLowest: { x: number; y: number } = { x: 0, y: 0 };
  public pathHighest: { x: number; y: number } = { x: 0, y: 0 };
  public currentFloor: string = "L1";
  public path: MapNode[] = [];
  public frames: number[][][] = [[[]]];
  public redraw: boolean = true;
  public scalar: number = 1;
  public offset: { x: number; y: number } = { x: 0, y: 0 };
  public upleftCorner: { x: number; y: number } | undefined = { x: 0, y: 0 };
  public downrightCorner: { x: number; y: number } | undefined = { x: 0, y: 0 };
  public centerPos: { x: number; y: number } | undefined = { x: 0, y: 0 };
  public image = new Image();

  setImage(imageSrc: string) {
    this.image = new Image();
    this.image.src = imageSrc;
  }

  // converts coordinates from page frame to image frame
  tfPoint(x: number, y: number) {
    if (ctx === null) {
      return undefined;
    }
    const origin = new DOMPoint(x, y);
    return ctx!.getTransform().invertSelf().transformPoint(origin);
  }
  // updates coordinate points for map panning and zooming
  updateCoords() {
    this.centerPos = this.tfPoint(
      (window.innerWidth - this.offset.x) / 2,
      (window.innerHeight - this.offset.y) / 2,
    );
    //upleftCorner = tfPoint(0, 0);
    this.upleftCorner!.x = this.tfPoint(0, 0)!.x;
    this.upleftCorner!.y = this.tfPoint(0, 0)!.y;
    this.downrightCorner = this.tfPoint(window.innerWidth, window.innerHeight);
  }
  setOffset(top: number, left: number) {
    this.offset.y = top;
    this.offset.x = left;
  }
  setScalar(value: number) {
    this.scalar = value;
  }
  setCurrentFloor(value: string) {
    this.currentFloor = value;
  }
  clearFloors() {
    this.floors = [];
  }
  resetPath() {
    this.path = [];
    this.frames = [[[]]];
  }
  framePush(temp: number[][]) {
    this.frames.push(temp);
  }
  setRedraw(value: boolean) {
    this.redraw = value;
  }
  resetMap() {
    this.resetPath();
    ctx!.scale(1 / this.scalar, 1 / this.scalar);
    this.setScalar(1);
    this.updateCoords();
    ctx!.translate(this.upleftCorner!.x, this.upleftCorner!.y);
    this.updateCoords();
    this.setRedraw(true);
  }
}

export const drawData = new DrawData();

drawData.image.src = "00_thelowerlevel1.png";
