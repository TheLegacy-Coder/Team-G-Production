import React, { useEffect, useState } from "react";
import "./styles/LocationDropdown.css";
import { MapNode, mapNodes } from "../map/MapNode.ts"; // Importing MapNode type

const LocationDropdown: React.FC = () => {
  const [startLocations, setStartLocations] = useState<MapNode[]>([]);
  const [endLocations, setEndLocations] = useState<MapNode[]>([]);
  const [selectedStartLocation, setSelectedStartLocation] =
    useState<string>("");
  const [selectedEndLocation, setSelectedEndLocation] = useState<string>("");

  // Fetch map nodes and set start and end locations
  useEffect(() => {
    const fetchMapNodes = async () => {
      try {
        // Fetch map nodes from the mapNodes variable
        const nodes = Array.from(mapNodes.values());

        // Set start and end locations
        setStartLocations(nodes);
        setEndLocations(nodes);
      } catch (error) {
        console.error("Error fetching map nodes:", error);
      }
    };

    fetchMapNodes();
  }, []);

  // Event handler for selecting start location
  const handleStartLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedStartLocation(event.target.value);
  };

  // Event handler for selecting end location
  const handleEndLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedEndLocation(event.target.value);
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
        <label htmlFor="startLocation">Start Location:</label>
        <select
          id="startLocation"
          value={selectedStartLocation}
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
      <div className="dropdown">
        <label htmlFor="endLocation">End Location:</label>
        <select
          id="endLocation"
          value={selectedEndLocation}
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
    </div>
  );
};

export default LocationDropdown;
