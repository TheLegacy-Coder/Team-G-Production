import axios from "axios";
import { Edge } from "../map/MapNode.ts";
import { currentToken } from "../stores/LoginStore.ts";

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
          "https://ec2-18-221-74-82.us-east-2.compute.amazonaws.com/api/map/nodes",
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
          "https://ec2-18-221-74-82.us-east-2.compute.amazonaws.com/api/map/nodes",
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
  return axios.get(
    "https://ec2-18-221-74-82.us-east-2.compute.amazonaws.com/api/map/nodes",
  );
}

export function postEdgesAxios(deleteAll: string, importedMapEdge: Edge[]) {
  return new Promise((resolve, reject) => {
    if (deleteAll == "true") {
      axios
        .post(
          "https://ec2-18-221-74-82.us-east-2.compute.amazonaws.com/api/map/edges",
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
          "https://ec2-18-221-74-82.us-east-2.compute.amazonaws.com/api/map/edges",
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
  return axios.get(
    "https://ec2-18-221-74-82.us-east-2.compute.amazonaws.com/api/map/edges",
  );
}
