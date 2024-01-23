import rawNodes from "../../../Temporary/L1Nodes.txt";
import rawEdges from "../../../Temporary/L1Edges.txt";
export type MapNode = {
  nodeID: string;
  xcoord: number;
  ycoord: number;
  floor: string;
  buidling: string;
  nodeType: string;
  longName: string;
  shortName: string;
  edges: MapNode[];
};

//TODO: remove this and replace with an actual backend
export const mapNodes: Map<string, MapNode> = new Map([]);
fetch(rawNodes)
  .then((r) => r.text())
  .then((text) => {
    let headers = true;
    text.split("\n").forEach((line) => {
      if (headers) {
        headers = false;
      } else {
        const fields: string[] = line.split(",");
        const newNode: MapNode = {
          nodeID: fields[0],
          xcoord: parseInt(fields[1]),
          ycoord: parseInt(fields[2]),
          floor: fields[3],
          buidling: fields[4],
          nodeType: fields[5],
          longName: fields[6],
          shortName: fields[7],
          edges: [],
        };
        mapNodes.set(fields[0], newNode);
      }
    });
  });

fetch(rawEdges)
  .then((r) => r.text())
  .then((text) => {
    let headers = true;
    text.split("\n").forEach((line) => {
      if (headers) {
        headers = false;
      } else {
        const fields: string[] = line.split(",");
        if (fields[2] != undefined) {
          fields[2] = fields[2].replace("\r", "");
          const n1 = mapNodes.get(fields[1]);
          const n2 = mapNodes.get(fields[2]);
          if (n1 == undefined || n2 == undefined) {
            console.log("bad edge");
          } else {
            n1.edges.push(n2);
            n2.edges.push(n1);
          }
        }
      }
    });
  });

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
