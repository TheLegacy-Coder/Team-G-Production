import rawNodes from "../../../Temporary/L1Nodes.txt";
import rawEdges from "../../../Temporary/L1Edges.txt";
export type MapNode = {
  nodeID: string;
  xcoord: number;
  ycoord: number;
  floor: string;
  buidling: string;
  nodeType: string;
  //floor : 'l1' | 'l2',
  //building: '45 Francis' | 'Tower' | 'Shapiro',
  // nodeType : 'CONF' | 'DEPT' | 'HALL' | 'LABS' | 'REST' | 'RETL' | 'SERV' | 'HALL' | 'STAI' | 'ELV'
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
console.log(mapNodes);
