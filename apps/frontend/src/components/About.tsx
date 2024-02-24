import React, { useEffect, useRef, useState } from "react";
import "./styles/About.css";

export const About = () => {
  const container = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);

  const [scrollHeight, setScrollHeight] = useState<string>("");

  useEffect(() => {
    console.log(container.current ? container.current.clientHeight : 0);
    setScrollHeight(
      container.current
        ? container.current.clientHeight.toString()
        : "0" + "px",
    );
  }, []);

  return (
    <div className="encompassing-div" ref={container}>
      <div
        className="about-page-container"
        ref={scroll}
        style={{ height: scrollHeight }}
      >
        <div>WPI Computer Science Department</div>
        <div>CS3733-C24 Software Engineering, Prof. Wilson Wong</div>
        <div>Team Coach: Mike Wilkinson</div>
        <div className="about-page-row">
          <div className="about-page-column">
            <div className="about-page-card">
              <img src="istan.jpg" alt="Istan" />
              <div className="photo-container">
                <h2>Istan Slamet</h2>
                <p className="title">Documentation Analyst</p>
                <p>ISTAAAAAAAAAAAAAN</p>
                <p>ipslamet@wpi.edu</p>
                <p>
                  <button className="button">Contact</button>
                </p>
              </div>
            </div>
          </div>
          <div className="about-page-column">
            <div className="about-page-card">
              <img src="gabe.jpg" alt="Gabe" />
              <div className="photo-container">
                <h2>Gabriel Shiu</h2>
                <p className="title">Assistant Lead Software Engineer</p>
                <p>Shiu!</p>
                <p>gshiu@wpi.edu</p>
                <p>
                  <button className="button">Contact</button>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          We would like to thank Brigham and Women's Hospital and their
          representative, Andrew Shinn.
        </div>
        <div>
          The Brigham & Women's Hospital maps and data used in this application
          are copyrighted and provided for the sole use of educational purposes.
        </div>
      </div>
    </div>
  );
};
