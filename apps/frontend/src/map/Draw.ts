import {
  MapNode,
  mapNodes,
  mapEdges,
  getStartNode,
  getEndNode,
} from "./MapNode.ts";
import { hoverNode, mouse } from "./Mouse.ts";
import { drawData, ctx } from "./DrawData.ts";

/**
 * Issues that are occurring
 * pathInView causing bottom path from L2 to F3 to not draw from path in view function
 */

//Draws on canvas when map image loaded
drawData.image.onload = () => {
  setTimeout(() => {
    mouse.homePosition(drawData.currentFloor);
    draw.drawCanvas();
    drawData.setRedraw(true);
  }, 50);
};

class Draw {
  private drawStep = 0;

  public drawCanvas() {
    if (drawData.redraw) {
      // verifies canvas context is set up
      //ctx = canvasCtxRef.current;
      if (ctx !== null) {
        draw.drawStep = draw.drawStep - 1 >= 1 ? draw.drawStep - 1 : 50;
        // save the context data for tf
        ctx!.save();
        ctx!.setTransform(1, 0, 0, 1, 0, 0);
        ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx!.restore();
        // draws image
        ctx!.drawImage(drawData.image, 0, 0);

        //if draw edges
        if (drawData.showEdges) {
          mapNodes.forEach((node) => {
            if (node.floor === drawData.currentFloor) {
              ctx!.lineWidth = 3;
              ctx!.strokeStyle = "#AAAAAA";
              node.edges.forEach((edge) => {
                if (edge.floor === drawData.currentFloor) {
                  // Start a new Path
                  ctx!.beginPath();
                  ctx!.moveTo(node.xcoord, node.ycoord);
                  ctx!.lineTo(edge.xcoord, edge.ycoord);
                  // Draw the Path
                  ctx!.stroke();
                }
              });
            }
          });
        }

        // draws the path trail
        if (drawData.frames[draw.drawStep] != undefined) {
          drawData.frames[draw.drawStep].forEach((frame) => {
            ctx!.beginPath();
            ctx!.arc(frame[0], frame[1], 5, 0, 2 * Math.PI, false);
            ctx!.fillStyle = "#0000FF";
            ctx!.fill();
          });
        }

        mapNodes.forEach((node) => {
          if (
            node.floor === drawData.currentFloor &&
            ((drawData.showNodes && node.nodeType !== "HALL") ||
              (drawData.showHalls && node.nodeType === "HALL"))
          ) {
            ctx!.beginPath();
            ctx!.arc(node.xcoord, node.ycoord, 10, 0, 2 * Math.PI, false);
            ctx!.fillStyle =
              getStartNode() == node
                ? "#00FF00"
                : getEndNode() == node
                  ? "#00ffff"
                  : hoverNode == node
                    ? "#0000FF"
                    : drawData.getSwitchNodes().includes(node)
                      ? "#ffff00"
                      : "#FF0000";
            ctx!.fill();
            ctx!.lineWidth = 5;
            ctx!.strokeStyle = "#330000";
            ctx!.stroke();
          }
        });

        draw.drawFloorChange();
        if (
          hoverNode !== undefined &&
          ((drawData.showNodes && hoverNode.nodeType !== "HALL") ||
            (drawData.showHalls && hoverNode.nodeType === "HALL"))
        )
          draw.drawNodeDetails(hoverNode);

        let pathInView = true;
        if (mouse.inView()) {
          pathInView = true;
        }

        let currentSelectedFloor = drawData.currentFloor;
        if (currentSelectedFloor.length == 1) {
          currentSelectedFloor = "F" + currentSelectedFloor;
        }
        if (
          (getStartNode() === undefined ||
            getEndNode() === undefined ||
            !drawData.floors.includes(currentSelectedFloor) ||
            !pathInView) &&
          mapNodes.size !== 0
        )
          drawData.setRedraw(false);
      }
    }
    setTimeout(draw.drawCanvas, 16);
  }

  public getContentWidth(prevNum: number, inString: string): number {
    if (inString.length > prevNum) {
      return inString.length;
    }
    return prevNum;
  }

  private drawFloorChange() {
    ctx!.font = "bold 12pt Courier";
    let index = 0;
    drawData.getSwitchNodes().forEach((node) => {
      if (node.floor === drawData.currentFloor) {
        ctx!.beginPath();
        ctx!.fillStyle = "#ffffff";
        ctx!.strokeStyle = "#000000";
        ctx!.fillRect(node.xcoord - 55, node.ycoord - 40, 110, 20);
        ctx!.strokeRect(node.xcoord - 55, node.ycoord - 40, 110, 20);
        ctx!.fill();
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.textAlign = "center";
        ctx!.fillStyle = "#000000";
        ctx!.fillText(
          "Floor: " + drawData.getSwitchFloors()[index],
          node.xcoord,
          node.ycoord - 25,
        );
        ctx!.fill();
      }
      index++;
    });
  }
  private drawNodeDetails(node: MapNode) {
    ctx!.fillStyle = "#FFFFFF";
    ctx!.strokeStyle = "#000000";
    ctx!.lineWidth = 5 / drawData.scalar;
    const content: string[] = [];
    let contentWidth: number = node.shortName.length;
    content.push(node.shortName);
    contentWidth = draw.getContentWidth(
      contentWidth,
      "x: " + node.xcoord.toString() + ", y: " + node.ycoord.toString(),
    );
    content.push(
      "x: " + node.xcoord.toString() + ", y: " + node.ycoord.toString(),
    );
    content.push("Adjacent Nodes:");
    contentWidth = draw.getContentWidth(contentWidth, "Adjacent Nodes:");
    let lineCount = 3;
    for (let i = 0; i < node.edges.length; i++) {
      lineCount++;
      content.push(node.edges[i].shortName);
      contentWidth = draw.getContentWidth(
        contentWidth,
        node.edges[i].shortName,
      );
    }
    content.push("Adjacent Edges:");
    contentWidth = draw.getContentWidth(contentWidth, "Adjacent Edges:");
    lineCount++;

    for (let i = 0; i < node.edges.length; i++) {
      lineCount++;
      let lineContent = "";
      mapEdges.forEach((edge) => {
        if (
          (edge.startNode === node.nodeID &&
            edge.endNode === node.edges[i].nodeID) ||
          (edge.endNode === node.nodeID &&
            edge.startNode === node.edges[i].nodeID)
        ) {
          lineContent = edge.edgeID;
        }
      });
      content.push(lineContent);
      contentWidth = draw.getContentWidth(contentWidth, lineContent);
    }

    ctx!.fillRect(
      node.xcoord - (contentWidth * 9) / 2 / drawData.scalar,
      node.ycoord + 15,
      (contentWidth * 9) / drawData.scalar,
      5 + (15 / drawData.scalar) * lineCount,
    );
    ctx!.strokeRect(
      node.xcoord - (contentWidth * 9) / 2 / drawData.scalar,
      node.ycoord + 15,
      (contentWidth * 9) / drawData.scalar,
      5 + (15 / drawData.scalar) * lineCount,
    );
    ctx!.font = "bold " + (10 / drawData.scalar).toString() + "pt Courier";
    ctx!.textAlign = "center";
    ctx!.fillStyle = "#550000";
    for (let i = 0; i < lineCount; i++) {
      ctx!.fillText(
        content[i],
        node.xcoord,
        node.ycoord + 14 + (14 / drawData.scalar) * (i + 1),
      );
    }
  }
}

export const draw = new Draw();
