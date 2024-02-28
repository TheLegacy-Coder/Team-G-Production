import React, { useEffect, useRef, useState } from "react";
import "./styles/HelpPage.css";

export const HelpPage = () => {
  const container = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);

  const [scrollHeight, setScrollHeight] = useState<string>("");

  useEffect(() => {
    setScrollHeight(
      container.current
        ? container.current.clientHeight.toString()
        : "0" + "px",
    );
  }, []);

  return (
    <div className="encompassing-div" ref={container}>
      <div
        className="help-page-container"
        ref={scroll}
        style={{ height: scrollHeight }}
      >
        <img
          src="Brigham_and_Womens_Hospital_horiz_rgb.png"
          alt="Hospital Logo"
          width="414"
          height="47"
        />
        <br />
        <br />
        <div>
          Thank you for choosing Brigham & Women's Hospital Navigation Program
          to assist you during your visit to our medical facility. We understand
          that navigating a hospital can sometimes be overwhelming, which is why
          we've designed this program to make your experience as smooth and
          stress-free as possible.
        </div>
        <br />
        <div>
          Interactive Map: Explore our hospital layout with an interactive map
          feature. You can zoom in, zoom out, and even get directions to your
          desired destination.
        </div>
        <br />
        <div>
          Search for Locations: Click on the dot at which you are located and
          then another dot represent a specific department, clinic, or amenity
          within the hospital.
        </div>
        <br />
        <div>
          Contact{" "}
          <a href="mailto:softengc24G@gmail.com?subject=Question%20about%20Hospital%20Navigation">
            softengc24G@gmail.com
          </a>{" "}
          for questions
        </div>
      </div>
    </div>
  );
};
