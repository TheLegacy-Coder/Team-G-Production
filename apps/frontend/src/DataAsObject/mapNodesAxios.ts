import axios from "axios";
import { Edge } from "../map/MapNode.ts";
import { currentToken } from "../stores/LoginStore.ts";
import { link } from "./links.ts";

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

export function postNodesAxios(
  deleteAll: string,
  importedMapNode: importedMapNodes[],
) {
  return new Promise((resolve, reject) => {
    if (deleteAll == "true") {
      axios
        .post(
          link + "/api/map/nodes",
          {
            deleteAll: true,
            nodes: importedMapNode,
          },
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          },
        )
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
        .post(
          link + "/api/map/nodes",
          {
            deleteAll: false,
            nodes: importedMapNode,
          },
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          },
        )
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

export function getNodesAxios() {
  return axios.get(link + "/api/map/nodes");
}

export function postEdgesAxios(deleteAll: string, importedMapEdge: Edge[]) {
  return new Promise((resolve, reject) => {
    if (deleteAll == "true") {
      axios
        .post(
          link + "/api/map/edges",
          {
            deleteAll: true,
            edges: importedMapEdge,
          },
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          },
        )
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
        .post(
          link + "/api/map/edges",
          {
            deleteAll: false,
            edges: importedMapEdge,
          },
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          },
        )
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

export function getEdgesAxios() {
  return axios.get(link + "/api/map/edges");
}
