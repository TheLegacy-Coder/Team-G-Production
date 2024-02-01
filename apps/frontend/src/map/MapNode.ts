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

export const mapNodes: Map<string, MapNode> = new Map([]);

class NodeStore {
  public selectedNode: MapNode | undefined = undefined;
  public currentRefresh: DispatchWithoutAction | undefined;
  setSelectedNode(node: MapNode | undefined) {
    this.selectedNode = node;
    console.log(node);
    console.log(this.currentRefresh);
    if (this.currentRefresh !== undefined) {
      console.log("refreshing");
      this.currentRefresh();
    }
  }
}

export const nodeStore = new NodeStore();

axios
  .get("http://localhost:3000/api/map/nodes")
  .then((response: AxiosResponse<MapNode[]>) => {
    console.log(response.data);
    response.data.forEach((node) => {
      node.edges = [];
      mapNodes.set(node.nodeID, node);
    });

    axios
      .get("http://localhost:3000/api/map/edges")
      .then((response: AxiosResponse<Edge[]>) => {
        console.log(response.data);
        response.data.forEach((edge) => {
          const n1 = mapNodes.get(edge.startNode);
          const n2 = mapNodes.get(edge.endNode);
          if (n1 == undefined || n2 == undefined) {
            console.log("bad edge");
          } else {
            n1.edges.push(n2);
            n2.edges.push(n1);
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

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

export function BreadthFirstSearch(
  start: MapNode | undefined,
  end: MapNode | undefined,
) {
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
console.log(mapNodes);
