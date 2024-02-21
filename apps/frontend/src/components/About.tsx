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
        <div>
          <table>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Thomas Branchaud</td>
                <td>Scrum Master</td>
              </tr>
              <tr>
                <td>Camren Chraplak</td>
                <td>Product Owner</td>
              </tr>
              <tr>
                <td>Klaudio Fusha</td>
                <td>Assistant Lead Software Engineer</td>
              </tr>
              <tr>
                <td>Tyler Giroux</td>
                <td>Project Manager</td>
              </tr>
              <tr>
                <td>Silas Joy</td>
                <td>Full-Time Software Engineer (Front/Back-End)</td>
              </tr>
              <tr>
                <td>Zachary Medailleu</td>
                <td>Full-Time Software Engineer (Front-End)</td>
              </tr>
              <tr>
                <td>Noah Newton</td>
                <td>Full-Time Software Engineer (Back-End)</td>
              </tr>
              <tr>
                <td>Dimitri Saliba</td>
                <td>Lead Developer</td>
              </tr>
              <tr>
                <td>Gabriel Shiu</td>
                <td>Assistant Lead Software Engineer</td>
              </tr>
              <tr>
                <td>Istan Slamet</td>
                <td>Documentation Analyst</td>
              </tr>
              <tr>
                <td>Jason Zhang</td>
                <td>Full-Time Software Engineer (Front-End)</td>
              </tr>
            </tbody>
          </table>
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
