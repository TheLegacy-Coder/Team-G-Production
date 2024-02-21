import axios from "axios";
import { Edge } from "../map/MapNode.ts";

type importedMapNodes = {
  nodeID: string;
  xcoord: number;
  ycoord: number;
  floor: string;
  building: string;
  nodeType: string;
  longName: string;
  shortName: string;
};

export function postNodes(
  deleteAll: string,
  importedMapNode: importedMapNodes[],
) {
  return new Promise((resolve, reject) => {
    if (deleteAll == "true") {
      axios
        .post("http://localhost:3000/api/map/nodes", {
          deleteAll: true,
          nodes: importedMapNode,
        })
        .then(() => {
          resolve("Nodes Added");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    } else {
      axios
        .post("http://localhost:3000/api/map/nodes", {
          deleteAll: false,
          nodes: importedMapNode,
        })
        .then(() => {
          resolve("Nodes Added");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    }
  });
}

export function postEdges(deleteAll: string, importedMapEdge: Edge[]) {
  return new Promise((resolve, reject) => {
    if (deleteAll == "true") {
      axios
        .post("http://localhost:3000/api/map/edges", {
          deleteAll: true,
          edges: importedMapEdge,
        })
        .then(() => {
          resolve("Edges Added");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    } else {
      axios
        .post("http://localhost:3000/api/map/edges", {
          deleteAll: false,
          edges: importedMapEdge,
        })
        .then(() => {
          resolve("Edges Added");
          return;
        })
        .catch((error) => {
          reject(error);
          return;
        });
    }
  });
}
