import {
  SearchStrategy,
  getEndNode,
  getStartNode,
  MapNode,
  BreadthFirstSearch,
  setStartNode,
  setEndNode,
  AStarSearch,
  DijkstraSearch,
} from "./MapNode.ts";

import { drawData } from "./DrawData.ts";

class MapAlgorithm {
  private startNode: MapNode | undefined = undefined;
  private endNode: MapNode | undefined = undefined;
  private imageWidth = 5000;
  private imageHeight = 3400;
  private spacing = 50;
  private totalDistance = 0;
  private steps: number[] = [];
  private searchStrategy: SearchStrategy = new BreadthFirstSearch();

  public setSearchStrategy(searchStrategy: SearchStrategy) {
    this.searchStrategy = searchStrategy;
  }

  private setFloorButtons() {
    for (let i = 0; i < drawData.floors.length; i++) {
      if (drawData.floors[i].length === 1)
        drawData.floors[i] = "F" + drawData.floors[i];
      const scaleID = document.querySelector("#" + drawData.floors[i]);
      if (scaleID !== null) {
        scaleID!.classList.add("path-floor");
      }
    }
  }

  public searchAlg() {
    if (getStartNode() === getEndNode() && getStartNode() !== undefined) {
      alert("Can't select same node!");
      setStartNode(undefined);
      setEndNode(undefined);
      this.startNode = undefined;
      this.endNode = undefined;
    }
    // filters path not on floor
    drawData.unfilteredPath = this.searchStrategy.pathfindingAlgorithm(
      getStartNode(),
      getEndNode(),
    );

    const switchedNodes: MapNode[] = [];
    const switchedFloors: string[] = [];

    const allSwitchNodes: MapNode[] = [];
    const allSwitchFloors: string[] = [];

    drawData.clearFloors();

    drawData.setPathLowest(this.imageWidth, this.imageHeight);
    drawData.setPathHighest(0, 0);

    let prevNode: undefined | MapNode = undefined;
    drawData.unfilteredPath.forEach((node) => {
      if (node.floor === drawData.currentFloor) drawData.path.push(node);
      if (!drawData.floors.includes(node.floor))
        drawData.floors.push(node.floor);
      if (node.floor !== prevNode?.floor && prevNode !== undefined) {
        if (drawData.currentFloor === node.floor) {
          switchedNodes.push(node);
          switchedFloors.push(prevNode.floor);
        } else {
          switchedNodes.push(prevNode);
          switchedFloors.push(node.floor);
        }

        allSwitchNodes.push(prevNode);
        allSwitchFloors.push(prevNode.floor);
        allSwitchNodes.push(node);
        allSwitchFloors.push(prevNode.floor);
      }
      prevNode = node;
    });

    drawData.setSwitchNodes(switchedNodes, switchedFloors);
    drawData.setAllSwitchNodes(allSwitchNodes, allSwitchFloors);

    this.setFloorButtons();

    this.totalDistance = 0;
    this.steps = [0];
    let last: MapNode | undefined = undefined;
    // gets distance based on connected nodes
    drawData.path.forEach((node) => {
      if (last != undefined) {
        const length = Math.sqrt(
          Math.pow(last.ycoord - node.ycoord, 2) +
            Math.pow(last.xcoord - node.xcoord, 2),
        );
        this.totalDistance += length;
        this.steps.push(this.totalDistance);
      }
      last = node;
    });
    //bake frames
    for (let f = 0; f < this.spacing; f++) {
      const temp: number[][] = [];
      for (let i = 0; i < this.totalDistance / this.spacing; i++) {
        let prog = this.spacing * i + (f % this.spacing);
        let s = 0;
        while (s < drawData.path.length) {
          if (prog < this.steps[s]) {
            break;
          }
          s++;
        }
        s--;
        prog -= this.steps[s];
        if (
          s + 1 < drawData.path.length &&
          drawData.path[s + 1].edges.includes(drawData.path[s])
        ) {
          const angleRadians = Math.atan2(
            drawData.path[s].ycoord - drawData.path[s + 1].ycoord,
            drawData.path[s].xcoord - drawData.path[s + 1].xcoord,
          );
          const x = drawData.path[s].xcoord - Math.cos(angleRadians) * prog;
          const y = drawData.path[s].ycoord - Math.sin(angleRadians) * prog;
          temp.push([x, y]);
          if (x < drawData.pathLowest.x) {
            drawData.setPathLowest(x, drawData.pathLowest.y);
          } else if (x > drawData.pathHighest.x) {
            drawData.setPathHighest(x, drawData.pathHighest.y);
          }
          if (y < drawData.pathLowest.y) {
            drawData.setPathLowest(drawData.pathLowest.x, y);
          } else if (y > drawData.pathHighest.y) {
            drawData.setPathHighest(drawData.pathHighest.x, y);
          }
        }
      }
      //frames.push(temp);
      drawData.framePush(temp);
    }
    if (drawData.pathLowest.x === this.imageWidth) {
      drawData.setPathLowest(0, drawData.pathLowest.y);
    }
    if (drawData.pathHighest.x === 0) {
      drawData.setPathLowest(this.imageWidth, drawData.pathLowest.y);
    }
    if (drawData.pathLowest.y === this.imageHeight) {
      drawData.setPathLowest(drawData.pathLowest.x, 0);
    }
    if (drawData.pathHighest.y === 0) {
      drawData.setPathLowest(drawData.pathLowest.x, this.imageHeight);
    }
    drawData.setRedraw(true);
  }

  public nodePoll() {
    const prevStart = this.startNode;
    const prevEnd = this.endNode;
    this.startNode = getStartNode();
    this.endNode = getEndNode();
    if (prevStart !== this.startNode || prevEnd !== this.endNode) {
      const floorNames: string[] = ["F3", "F2", "F1", "L1", "L2"];
      for (let i = 0; i < floorNames.length; i++) {
        const scaleID = document.querySelector("#" + floorNames[i]);
        if (scaleID !== null) scaleID!.classList.remove("path-floor");
      }
      drawData.clearFloors();
      drawData.path.forEach((node) => {
        if (!drawData.floors.includes(node.floor))
          drawData.floors.push(node.floor);
      });
      this.setFloorButtons();
    }

    if (
      this.startNode !== undefined &&
      this.endNode !== undefined &&
      (prevStart !== this.startNode || prevEnd !== this.endNode)
    ) {
      drawData.resetPath();
      this.searchAlg();
    }
  }
}

export const algorithm = new MapAlgorithm();

const aStarSearch = new AStarSearch();
const dijkstraSearch = new DijkstraSearch();

algorithm.setSearchStrategy(aStarSearch || dijkstraSearch);
