import { MapNode } from "./MapNode.ts";

export let ctx: CanvasRenderingContext2D | null;

export function initCTX(ctxRef: CanvasRenderingContext2D | null) {
  ctx = ctxRef;
}

class DrawData {
  public unfilteredPath: MapNode[] = [];
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

  public showNodes = true;
  public showEdges = false;
  public showHalls = false;

  public switchNodes: MapNode[] = [];
  public switchFloors: string[] = [];

  public allSwitchNodes: MapNode[] = [];
  public allSwitchFloors: string[] = [];
  public setSwitchNodes(switchedNodes: MapNode[], switchedFloors: string[]) {
    this.switchNodes = switchedNodes;
    this.switchFloors = switchedFloors;
  }

  public setAllSwitchNodes(
    allSwitchNodes: MapNode[],
    allSwitchFloors: string[],
  ) {
    this.allSwitchNodes = allSwitchNodes;
    this.allSwitchFloors = allSwitchFloors;
  }

  public getSwitchNodes() {
    return this.switchNodes;
  }

  public getSwitchFloors() {
    return this.switchFloors;
  }

  public setPathLowest(pathX: number, pathY: number) {
    drawData.pathLowest = { x: pathX, y: pathY };
  }

  public setPathHighest(pathX: number, pathY: number) {
    drawData.pathHighest = { x: pathX, y: pathY };
  }

  public setUpLeft(xPos: number, yPos: number) {
    drawData.upleftCorner = { x: xPos, y: yPos };
  }

  public setDownRight(xPos: number, yPos: number) {
    drawData.downrightCorner = { x: xPos, y: yPos };
  }

  public setCenterPos(xPos: number, yPos: number) {
    drawData.centerPos = { x: xPos, y: yPos };
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
    const upLeft = this.tfPoint(0, 0);
    if (upLeft !== undefined) {
      this.setUpLeft(upLeft.x, upLeft.y);
    }

    const downRight = this.tfPoint(window.innerWidth, window.innerHeight);
    if (downRight !== undefined) {
      this.setDownRight(downRight.x, downRight.y);
    }
    const center = this.tfPoint(window.innerWidth / 2, window.innerHeight / 2);
    //const center = new DOMPoint((downRight!.x - upLeft!.x)/2, (downRight!.y - upLeft!.y)/2);

    if (center !== undefined) {
      this.setCenterPos(center.x, center.y);
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
  public resetMap(newFloor: boolean): boolean {
    let hasPath = false;
    if (this.path.length > 0) {
      hasPath = true;
    }
    if (newFloor) {
      this.resetPath();
    }
    ctx!.scale(1 / this.scalar, 1 / this.scalar);
    this.setScalar(1);
    this.updateCoords();
    ctx!.translate(this.upleftCorner!.x, this.upleftCorner!.y);
    this.updateCoords();
    this.setRedraw(true);
    return hasPath;
  }
}

export const drawData = new DrawData();

drawData.setImage("00_thelowerlevel1.png");
