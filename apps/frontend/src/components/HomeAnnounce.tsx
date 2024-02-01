import React, { useReducer } from "react";
import "./styles/HomeAnnounce.css";

export const HomeAnnounce = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const divRef = document.getElementById("marquee-content");
  console.log(divRef === null ? 100 : divRef.getBoundingClientRect().width);
  //const speed = (divRef===null?100:divRef.scrollWidth)/window.innerWidth;//logic
  const pxps = 20;
  const speed =
    divRef === null ? 100 : divRef.getBoundingClientRect().width / pxps;
  if (divRef === null) {
    setTimeout(forceUpdate, 100);
  }
  const text =
    "• Bob has been admitted after crashing his car into the hospital's front door • Staff Update: Wilson Wong has joined our team • Scrum Master Tommy Meet & Greet: 02/15/24 @ 3 PM • All this text is probably gonna make it overlap. I'm not a fan of this, so I wanna fix it soon.";
  const w = divRef === null ? 100 : divRef.scrollWidth;
  return (
    <div className={"announcements-bar"} id={"marquee-content"}>
      <style>
        {"@keyframes scroll-left {\n" +
          `  0% {\n` +
          `    transform: translateX(${w / 2}px);\n` +
          "  }\n" +
          `  100% {\n` +
          `    transform: translateX(-${w / 2}px);\n` +
          "  }\n" +
          "}\n"}
      </style>

      <style>
        {"@keyframes scroll-left2 {\n" +
          `  0% {\n` +
          `    transform: translateX(-${w / 2}px);\n` +
          "  }\n" +
          `  100% {\n` +
          `    transform: translateX(-${3 * (w / 2)}px);\n` +
          "  }\n" +
          "}\n"}
      </style>

      <div
        className={"marquee"}
        style={{ animation: `scroll-left ${speed}s linear infinite` }}
      >
        {text}
      </div>
      <div
        className={"marquee"}
        style={{ animation: `scroll-left2 ${speed}s linear infinite` }}
      >
        {text}
      </div>
    </div>
  );
};
