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
              <img src="istan.jpg" alt="Istan" width="100" height="100" />
              <div className="photo-container">
                <h2>Istan Slamet</h2>
                <p className="title">Documentation Analyst</p>
              </div>
            </div>
          </div>
          <div className="about-page-column">
            <div className="about-page-card">
              <img src="gabe.jpg" alt="Gabe" width="100" height="100" />
              <div className="photo-container">
                <h2>Gabriel Shiu</h2>
                <p className="title">Assistant Lead Software Engineer</p>
              </div>
            </div>
          </div>
          <div className="about-page-column">
            <div className="about-page-card">
              <img src="dimitri.png" alt="Dimitri" width="100" height="100" />
              <div className="photo-container">
                <h2>Dimitri Saliba</h2>
                <p className="title">Lead Software Developer</p>
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
