import React, { useEffect, useRef, useState } from "react";
import "./styles/About.css";
import { TalkingHead } from "./TalkingHead.tsx";

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
        <div className={"head-container"}>
          <TalkingHead
            name={"Dimitri Saliba"}
            voice={"Google 日本人"}
            mouthClosedImage={"dimitri/close.jpg"}
            mouthOpenImage={"dimitri/open.jpg"}
            getText={() => {
              return "If at first you dont succeed, add dash dash force and try again.";
            }}
          />

          <TalkingHead
            name={"Tyler Giroux"}
            voice={"Google 日本人"}
            mouthClosedImage={"tyler/close.jpg"}
            mouthOpenImage={"tyler/open.jpg"}
            getText={() => {
              return "A duck walked up to a lemonade stand And he said to the man, running the stand Hey! (Bum bum bum) Got any grapes?";
            }}
          />

          <TalkingHead
            name={"Klaudio Fusha"}
            voice={"Google UK English Male"}
            mouthClosedImage={"klaudio/close.jpg"}
            mouthOpenImage={"klaudio/open.jpg"}
            getText={() => {
              return "I'm a dreamer. I have to dream and reach for the stars, and if I miss a star then I grab a handful of clouds.";
            }}
          />

          <TalkingHead
            name={"Camren Chraplak"}
            voice={"Google UK English Male"}
            mouthClosedImage={"cam/close.jpg"}
            mouthOpenImage={"cam/open.jpg"}
            getText={() => {
              return "When the going gets tough the tough get going.";
            }}
          />

          <TalkingHead
            name={"Zach Medailleu"}
            voice={"Google UK English Male"}
            mouthClosedImage={"zach/close.jpg"}
            mouthOpenImage={"zach/open.jpg"}
            getText={() => {
              return "Insert cash or select payment type.";
            }}
          />

          <TalkingHead
            name={"Gabriel Shiu"}
            voice={"Google UK English Male"}
            mouthClosedImage={"gabe/close.jpg"}
            mouthOpenImage={"gabe/open.jpg"}
            getText={() => {
              return "I'd do anything for a lifetime of scrums with scrum master Tommy";
            }}
          />

          <TalkingHead
            name={"Silas Joy"}
            voice={"Google UK English Male"}
            mouthClosedImage={"silas/close.jpg"}
            mouthOpenImage={"silas/open.jpg"}
            getText={() => {
              return "Waka waka waka waka";
            }}
          />

          <TalkingHead
            name={"Thomas Branchaud"}
            voice={"Google UK English Male"}
            mouthClosedImage={"tommy/close.jpg"}
            mouthOpenImage={"tommy/open.jpg"}
            getText={() => {
              return "Zero all nighters needed, guess we are just better.";
            }}
          />

          <TalkingHead
            name={"Noah Newton"}
            voice={"Google 日本人"}
            mouthClosedImage={"noah/close.jpg"}
            mouthOpenImage={"noah/open.jpg"}
            getText={() => {
              return "Throughout heaven and earth, I alone am the destroyer of the main branch";
            }}
          />

          <TalkingHead
            name={"Istan Slamet"}
            voice={"Google 日本人"}
            mouthClosedImage={"istan/close.jpg"}
            mouthOpenImage={"istan/open.jpg"}
            getText={() => {
              return "The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues.";
            }}
          />

          <TalkingHead
            name={"Jason Zhang"}
            voice={"Google 日本人"}
            mouthClosedImage={"jason/close.jpg"}
            mouthOpenImage={"jason/open.jpg"}
            getText={() => {
              return "If you obey all the rules you miss all the fun.";
            }}
          />

          <TalkingHead
            name={"Mike Wilkinson (SA)"}
            voice={"Google 日本人"}
            mouthClosedImage={"mike/close.jpg"}
            mouthOpenImage={"mike/open.jpg"}
            getText={() => {
              return "Good job on the talking heads Dimitri im very proud of you.";
            }}
          />
        </div>

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
