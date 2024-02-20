import axios, { AxiosResponse } from "axios";
import { DispatchWithoutAction } from "react";

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

  setSelectedNode(node: MapNode | undefined) {
    this.selectedNode = node;
    // console.log(this.currentRefresh);
    if (this.currentRefresh !== undefined) {
      // console.log("refreshing");
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
    axios
      .get("http://localhost:3000/api/map/nodes")
      .then((response: AxiosResponse<MapNode[]>) => {
        // console.log(response.data);
        response.data.forEach((node) => {
          node.edges = [];
          mapNodes.set(node.nodeID, node);
        });

        axios
          .get("http://localhost:3000/api/map/edges")
          .then((response: AxiosResponse<Edge[]>) => {
            // console.log(response.data);
            response.data.forEach((edge) => {
              const n1 = mapNodes.get(edge.startNode);
              const n2 = mapNodes.get(edge.endNode);
              if (n1 == undefined || n2 == undefined) {
                // console.log("bad edge");
              } else {
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

//TODO: remove this and replace with an actual backend
//
// fetch(rawNodes)
//   .then((r) => r.text())
//   .then((text) => {
//     let headers = true;
//     text.split("\n").forEach((line) => {
//       if (headers) {
//         headers = false;
//       } else {
//         const fields: string[] = line.split(",");
//         const newNode: MapNode = {
//           nodeID: fields[0],
//           xcoord: parseInt(fields[1]),
//           ycoord: parseInt(fields[2]),
//           floor: fields[3],
//           buidling: fields[4],
//           nodeType: fields[5],
//           longName: fields[6],
//           shortName: fields[7],
//           edges: [],
//         };
//         mapNodes.set(fields[0], newNode);
//       }
//     });
//   });

// fetch(rawEdges)
//   .then((r) => r.text())
//   .then((text) => {
//     let headers = true;
//     text.split("\n").forEach((line) => {
//       if (headers) {
//         headers = false;
//       } else {
//         const fields: string[] = line.split(",");
//         if (fields[2] != undefined) {
//           fields[2] = fields[2].replace("\r", "");
//           const n1 = mapNodes.get(fields[1]);
//           const n2 = mapNodes.get(fields[2]);
//           if (n1 == undefined || n2 == undefined) {
//             console.log("bad edge");
//           } else {
//             n1.edges.push(n2);
//             n2.edges.push(n1);
//           }
//         }
//       }
//     });
//   });

export interface SearchStrategy {
  pathfindingAlgorithm: (
    start: MapNode | undefined,
    end: MapNode | undefined,
  ) => MapNode[];
}

export class AStarSearch implements SearchStrategy {
  pathfindingAlgorithm(start: MapNode | undefined, end: MapNode | undefined) {
    if (start == undefined || end == undefined) return [];

    const calculateHueristic = (node1: MapNode, node2: MapNode): number => {
      return Math.sqrt(
        Math.pow(node1.xcoord - node2.xcoord, 2) +
          Math.pow(node1.ycoord - node2.ycoord, 2) +
          100000000000 *
            Math.pow(
              floors.indexOf(node1.floor) - floors.indexOf(node2.floor),
              2,
            ),
      );
    };

    const seen: Map<MapNode, MapNode> = new Map([]);
    const gScore: Map<MapNode, number> = new Map([]);
    const fScore: Map<MapNode, number> = new Map([]);

    gScore.set(start, 0);
    fScore.set(start, calculateHueristic(start, end));

    const frontier: MapNode[] = [start];
    let done = false;

    while (!done || frontier.length !== 0) {
      // Sort frontier based on fScore
      frontier.sort((a, b) => (fScore.get(a) || 0) - (fScore.get(b) || 0));

      const current = frontier.shift() as MapNode;
      // console.log(current);
      // console.log(fScore);

      if (current === undefined) {
        return [];
      }
      if (current === end) {
        // Reconstruct path
        const path: MapNode[] = [];
        let currentPathNode = end;
        while (currentPathNode !== start) {
          path.unshift(currentPathNode);
          currentPathNode = seen.get(currentPathNode) as MapNode;
        }
        path.unshift(start);
        return path.reverse();
      }

      current.edges.forEach((neighbor) => {
        const tentativeGScore =
          (gScore.get(current) || 0) + calculateHueristic(current, neighbor);

        if (
          !gScore.has(neighbor) ||
          tentativeGScore < (gScore.get(neighbor) || 0)
        ) {
          seen.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(
            neighbor,
            tentativeGScore + calculateHueristic(neighbor, end),
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
}

export class BreadthFirstSearch implements SearchStrategy {
  pathfindingAlgorithm(start: MapNode | undefined, end: MapNode | undefined) {
    if (start == undefined || end == undefined) return [];
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
    console.log(seen);
    const path: MapNode[] = [];
    let current = end;
    while (seen.get(current) != current) {
      console.log(current);
      console.log(seen.get(current));
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
