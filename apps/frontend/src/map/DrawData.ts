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

  public setPathLowest(pathX: number, pathY: number) {
    this.pathLowest.x = pathX;
    this.pathLowest.y = pathY;
  }

  public setPathHighest(pathX: number, pathY: number) {
    this.pathHighest.x = pathX;
    this.pathHighest.y = pathY;
  }

  public setUpLeft(xPos: number, yPos: number) {
    this.upleftCorner = { x: xPos, y: yPos };
  }

  public setDownRight(xPos: number, yPos: number) {
    this.downrightCorner = { x: xPos, y: yPos };
  }

  public setCenterPos(xPos: number, yPos: number) {
    this.centerPos = { x: xPos, y: yPos };
  }

  public setImage(imageSrc: string) {
    this.image = new Image();
    this.image.src = imageSrc;
  }

  // converts coordinates from page frame to image frame
  public tfPoint(x: number, y: number) {
    if (ctx === null) {
      return undefined;
    }
    const origin = new DOMPoint(x, y);
    return ctx!.getTransform().invertSelf().transformPoint(origin);
  }
  // updates coordinate points for map panning and zooming
  public updateCoords() {
    const center = this.tfPoint(
      (window.innerWidth - this.offset.x) / 2,
      (window.innerHeight - this.offset.y) / 2,
    );

    if (center !== undefined) {
      this.setCenterPos(center.x, center.y);
    }
    const upLeft = this.tfPoint(0, 0);
    if (upLeft !== undefined) {
      this.setUpLeft(upLeft.x, upLeft.y);
    }

    const downRight = this.tfPoint(window.innerWidth, window.innerHeight);
    if (downRight !== undefined) {
      this.setDownRight(downRight.x, downRight.y);
    }
  }
  public setOffset(top: number, left: number) {
    this.offset.y = top;
    this.offset.x = left;
  }
  public setScalar(value: number) {
    this.scalar = value;
  }
  public setCurrentFloor(value: string) {
    this.currentFloor = value;
  }
  public clearFloors() {
    this.floors = [];
  }
  public resetPath() {
    this.path = [];
    this.frames = [[[]]];
  }
  public framePush(temp: number[][]) {
    this.frames.push(temp);
  }
  public setRedraw(value: boolean) {
    this.redraw = value;
  }
  public resetMap() {
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

drawData.setImage("00_thelowerlevel1.png");
