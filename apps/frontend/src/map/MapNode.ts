import { AxiosResponse } from "axios";
import { DispatchWithoutAction } from "react";
import { getEdgesAxios, getNodesAxios } from "../DataAsObject/mapNodesAxios.ts";

export type MapNode = {
  nodeID: string;
  xcoord: number;
  ycoord: number;
  floor: string;
  building: string;
  nodeType: string;
  longName: string;
  shortName: string;
  edges: MapNode[];
};

export type Edge = {
  edgeID: string;
  startNode: string;
  endNode: string;
};

export const floors = ["L2", "L1", "1", "2", "3"];

export const mapNodes: Map<string, MapNode> = new Map([]);
export const mapEdges: Map<string, Edge> = new Map([]);

class NodeStore {
  public selectedNode: MapNode | undefined = undefined;
  public currentRefresh: DispatchWithoutAction | undefined;
  public currentAlg = "BFS";

  setSelectedNode(node: MapNode | undefined) {
    this.selectedNode = node;
    if (this.currentRefresh !== undefined) {
      this.currentRefresh();
    }
  }
}

export const nodeStore = new NodeStore();

getMapNodesEdges();

export function getMapNodesEdges() {
  mapNodes.clear();
  mapEdges.clear();
  return new Promise((resolve, reject) => {
    getNodesAxios()
      .then((response: AxiosResponse<MapNode[]>) => {
        response.data.forEach((node) => {
          node.edges = [];
          mapNodes.set(node.nodeID, node);
        });

        getEdgesAxios()
          .then((response: AxiosResponse<Edge[]>) => {
            response.data.forEach((edge) => {
              const n1 = mapNodes.get(edge.startNode);
              const n2 = mapNodes.get(edge.endNode);
              if (n1 !== undefined && n2 !== undefined) {
                n1.edges.push(n2);
                n2.edges.push(n1);
              }
              mapEdges.set(edge.edgeID, edge);
            });
            resolve(mapNodes);
          })
          .catch((error) => {
            reject("no");
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });
}

let startNode: MapNode | undefined;
let endNode: MapNode | undefined;

export function setStartNode(node: MapNode | undefined) {
  startNode = node;
}

export function getStartNode(): MapNode | undefined {
  return startNode;
}

export function setEndNode(node: MapNode | undefined) {
  endNode = node;
}

export function getEndNode(): MapNode | undefined {
  return endNode;
}

export interface SearchStrategy {
  pathfindingAlgorithm: (
    start: MapNode | undefined,
    end: MapNode | undefined,
  ) => MapNode[];
}

export class BreadthFirstSearch implements SearchStrategy {
  pathfindingAlgorithm(start: MapNode | undefined, end: MapNode | undefined) {
    if (start === undefined || end === undefined) return [];
    const seen: Map<MapNode, MapNode> = new Map([]);
    seen.set(start, start);
    const frontier: MapNode[] = [start];
    let done = false;
    while (!done || frontier.length != 0) {
      //frontier [0] is dequed element
      frontier[0].edges.forEach((node) => {
        if (!seen.has(node)) {
          seen.set(node, frontier[0]);
          if (node == end) {
            done = true;
          }
          frontier.push(node);
        }
      });
      frontier.shift();
    }
    const path: MapNode[] = [];
    let current = end;
    while (seen.get(current) != current) {
      path.push(current);
      const next = seen.get(current);
      current = next == undefined ? current : next;
    }
    path.push(start);
    return path;
  }
}

export class DepthFirstSearch implements SearchStrategy {
  pathfindingAlgorithm(start: MapNode | undefined, end: MapNode | undefined) {
    if (start == undefined || end == undefined) return [];
    const seen: Map<MapNode, MapNode> = new Map([]);
    seen.set(start, start);
    const stack: MapNode[] = [start];
    let done = false;
    while (!done && stack.length != 0) {
      const current = stack.pop();
      if (current) {
        current.edges.forEach((node) => {
          if (!seen.has(node)) {
            seen.set(node, current);
            if (node == end) {
              done = true;
            }
            stack.push(node);
          }
        });
      }
    }
    const path: MapNode[] = [];
    let current = end;
    while (seen.get(current) != current) {
      path.push(current);
      const next = seen.get(current);
      current = next == undefined ? current : next;
    }
    path.push(start);
    return path;
  }
}

abstract class SearchTemplate implements SearchStrategy {
  abstract calculateHeuristic(
    node1: MapNode | undefined,
    node2: MapNode | undefined,
  ): number;

  pathfindingAlgorithm(start: MapNode | undefined, end: MapNode | undefined) {
    if (start == undefined || end == undefined) return [];

    const seen: Map<MapNode, MapNode> = new Map([]);
    const gScore: Map<MapNode, number> = new Map([]);
    const fScore: Map<MapNode, number> = new Map([]);

    gScore.set(start, 0);
    fScore.set(start, this.calculateHeuristic(start, end));

    const frontier: MapNode[] = [start];
    let done = false;

    while (!done || frontier.length !== 0) {
      // Sort frontier based on fScore
      frontier.sort((a, b) => (fScore.get(a) || 0) - (fScore.get(b) || 0));

      const current = frontier.shift() as MapNode;

      if (current === undefined) {
        return [];
      }
      if (current === end) {
        return this.getPath(start, end, seen);
      }

      current.edges.forEach((neighbor) => {
        const tentativeGScore =
          (gScore.get(current) || 0) +
          this.calculateHeuristic(current, neighbor);

        if (
          !gScore.has(neighbor) ||
          tentativeGScore < (gScore.get(neighbor) || 0)
        ) {
          seen.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(
            neighbor,
            tentativeGScore + this.calculateHeuristic(neighbor, end),
          );

          if (!frontier.includes(neighbor)) {
            frontier.push(neighbor);
          }
        }

        if (neighbor === end) {
          done = true;
        }
      });
    }

    // If the loop completes without finding a path, return an empty array
    return [];
  }

  getPath(
    start: MapNode,
    end: MapNode,
    seen: Map<MapNode, MapNode>,
  ): MapNode[] {
    const path: MapNode[] = [];
    let currentPathNode = end;
    while (currentPathNode !== start) {
      path.unshift(currentPathNode);
      currentPathNode = seen.get(currentPathNode) as MapNode;
    }
    path.unshift(start);
    return path.reverse();
  }
}

export class AStarSearch extends SearchTemplate {
  calculateHeuristic(node1: MapNode, node2: MapNode): number {
    return Math.sqrt(
      Math.pow(node1.xcoord - node2.xcoord, 2) +
        Math.pow(node1.ycoord - node2.ycoord, 2) +
        100000000000 *
          Math.pow(
            floors.indexOf(node1.floor) - floors.indexOf(node2.floor),
            2,
          ),
    );
  }
}

export class DijkstraSearch extends SearchTemplate {
  calculateHeuristic(): number {
    return 0;
  }
}
