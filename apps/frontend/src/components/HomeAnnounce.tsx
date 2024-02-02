import React, { useReducer } from "react";
import "./styles/HomeAnnounce.css";
import {
  announcements,
  announcementsChanged,
  clearAnnouncementFlag,
  refreshAnnouncements,
} from "../stores/AnnouncementsStore.ts";

export const HomeAnnounce = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  let lock = false;

  if (!lock) {
    checkUpdates();
  }
  function checkUpdates() {
    if (announcementsChanged) {
      clearAnnouncementFlag();
      lock = true;
      forceUpdate();
      lock = false;
    }
    refreshAnnouncements();

    setTimeout(checkUpdates, 10000);
  }

  // const announcementArray: string[] = [
  //   "Bob has been admitted after crashing his car into the hospital's front door",
  //   "Staff Update: Wilson Wong has joined our team",
  //   "Dimitri has lost yet another star",
  //   "Scrum Master Tommy Meet & Greet: 02/15/24 @ 3 PM",
  //   "Team C has gone missing",
  // ];

  const announcementArray = announcements;

  let text = "";
  //add all announcements to a single string that will scroll through
  announcementArray.forEach((announcement, index) => {
    if (index != 0) {
      text = text.concat(" • ");
    }
    text = text.concat(announcement.desc);
  });
  if (announcementArray.length == 0) {
    text = "No announcements for today";
  }

  const divRef = document.getElementById("marquee-content");
  const divWidth = divRef === null ? 100 : divRef.getBoundingClientRect().width;
  console.log(divWidth);
  const pxps = 25;
  if (divRef === null) {
    setTimeout(forceUpdate, 100);
  }

  const textLength = text.length * 9; //approximate pixel size for 32px font

  //if announcements are small, base the length of the marquee on the div instead of char count
  let marqueeLength: number;
  if (textLength > divWidth) {
    marqueeLength = textLength;
  } else {
    marqueeLength = divWidth;
  }
  const speed = marqueeLength / pxps;

  return (
    <div className={"announcements-bar"} id={"marquee-content"}>
      <style>
        {"@keyframes scroll-left {\n" +
          `  0% {\n` +
          `    transform: translateX(${marqueeLength}px);\n` +
          "  }\n" +
          `  100% {\n` +
          `    transform: translateX(-${marqueeLength + 300}px);\n` +
          "  }\n" +
          "}\n"}
      </style>

      <style>
        {"@keyframes scroll-left2 {\n" +
          `  0% {\n` +
          `    transform: translateX(-${marqueeLength + 300}px);\n` +
          "  }\n" +
          `  100% {\n` +
          `    transform: translateX(-${3 * (marqueeLength + 300)}px);\n` +
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
