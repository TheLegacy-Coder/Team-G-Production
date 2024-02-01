import axios, { AxiosResponse } from "axios";
import { MapNode, mapNodes } from "../map/MapNode.ts";

interface ServiceRequest {
  requestID: string;
  requestType: string;
  location: string;
  handled: boolean;
  requester: string;
  helpingEmployee: string | null;
  desc: string;
  time: string; // Assuming a string formatted timestamp is received from the server
}

export const serviceRequests: Map<string, ServiceRequest> = new Map([]);

axios
  .get("http://localhost:3000/api/service-requests") // REPLACE WITH ACTUAL URL
  .then((response: AxiosResponse<ServiceRequest[]>) => {
    console.log(response.data);
    response.data.forEach((request) => {
      serviceRequests.set(request.requestID, request);
    });
  })
  .catch((error) => {
    console.error("Error fetching service requests:", error);
  });

// other code remains unchanged.

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
