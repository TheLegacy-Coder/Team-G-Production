import React, { useCallback, useEffect, useState } from "react";
import "./styles/LocationDropdown.css";
import {
  setStartNode,
  setEndNode,
  getEndNode,
  getStartNode,
  MapNode,
  mapNodes,
  nodeStore,
} from "../map/MapNode.ts"; // Importing MapNode type
import TextDirections from "./TextDirections.tsx";
import QRCode from "react-qr-code";
import { IP } from "../config.ts";

const LocationDropdown: React.FC = () => {
  const [startLocations, setStartLocations] = useState<MapNode[]>([]);
  const [endLocations, setEndLocations] = useState<MapNode[]>([]);
  const [selectedStartLocation, setSelectedStartLocation] = useState<
    MapNode | undefined
  >(undefined);
  const [selectedEndLocation, setSelectedEndLocation] = useState<
    MapNode | undefined
  >(undefined);
  //const [name,setName] = useState("");

  // Fetch map nodes and set start and end locations
  useEffect(() => {
    const fetchMapNodes = async () => {
      try {
        // Fetch map nodes from the mapNodes variable
        const nodes = Array.from(mapNodes.values()).filter(
          (node) => node.nodeType !== "HALL",
        );

        // Set start and end locations
        setStartLocations(nodes);
        setEndLocations(nodes);
      } catch (error) {
        console.error("Error fetching map nodes:", error);
      }
    };

    //fetchMapNodes();
    setInterval(fetchMapNodes, 100);
  }, []);

  const poll = useCallback(() => {
    setSelectedStartLocation(getStartNode());
    setSelectedEndLocation(getEndNode());
  }, [setSelectedStartLocation, setSelectedEndLocation]);

  useEffect(() => {
    const intervalID = setInterval(poll, 10);
    return () => clearInterval(intervalID);
  }, [poll]);

  // Event handler for selecting start location
  const handleStartLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedNodeID = event.target.value;
    const node = mapNodes.get(selectedNodeID);
    if (node) {
      console.log("Got start location: " + node.nodeID);
      setStartNode(node);
    }
  };

  // Event handler for selecting end location
  const handleEndLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedNodeID = event.target.value;
    const node = mapNodes.get(selectedNodeID);
    if (node) {
      console.log("Got end location: " + node.nodeID);
      setEndNode(node);
    }
  };

  // Pathfinding logic can go here
  useEffect(() => {
    // Check if both start and end locations are selected
    if (selectedStartLocation && selectedEndLocation) {
      // Perform pathfinding logic here
      console.log("Start Location:", selectedStartLocation);
      console.log("End Location:", selectedEndLocation);
    }
  }, [selectedStartLocation, selectedEndLocation]);

  return (
    <div className="location-dropdowns">
      <div className="dropdown">
        <br />
        <label htmlFor="startLocation">Start Location:</label>
        <select
          className={"start-location"}
          id="startLocation"
          value={selectedStartLocation ? selectedStartLocation.nodeID : ""}
          onChange={handleStartLocationChange}
        >
          <option value="">Select start location</option>
          {/* Render options for start location */}
          {startLocations.map((node) => (
            <option key={node.nodeID} value={node.nodeID}>
              {node.longName}
            </option>
          ))}
        </select>
      </div>
      <br />
      <div className="dropdown">
        <label htmlFor="endLocation">End Location:</label>
        <select
          className={"end-location"}
          id="endLocation"
          value={selectedEndLocation ? selectedEndLocation.nodeID : ""}
          onChange={handleEndLocationChange}
        >
          <option value="">Select end location</option>
          {/* Render options for end location */}
          {endLocations.map((node) => (
            <option key={node.nodeID} value={node.nodeID}>
              {node.longName}
            </option>
          ))}
        </select>
      </div>
      <br />
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "50%", width: "50%" }}
        value={`${IP}/mobiledirections?alg=${nodeStore.currentAlg}&start=${getStartNode()?.nodeID}&end=${getEndNode()?.nodeID}`}
        viewBox={`0 0 256 256`}
      />
      <br />
      <b>Text Directions:</b>
      <TextDirections />
    </div>
  );
};

export default LocationDropdown;
