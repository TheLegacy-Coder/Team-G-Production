import React, { useReducer } from "react";
import "./styles/HomeAnnounce.css";

export const HomeAnnounce = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const announcementArray: string[] = [
    "Bob has been admitted after crashing his car into the hospital's front door",
    "Staff Update: Wilson Wong has joined our team",
    "Dimitri has lost yet another star",
    "Scrum Master Tommy Meet & Greet: 02/15/24 @ 3 PM",
    "Team C has gone missing",
  ];

  let text = "";
  //add all announcements to a single string that will scroll through
  announcementArray.forEach((announcement, index) => {
    if (index != 0) {
      text = text.concat(" • ");
    }
    text = text.concat(announcement);
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
  //const text =
  //"As literally stated, Prince Shoutoku – according to legend – was so smart that he could understand ten people questioning him at once, and reply to each of them with perfect answers. This is pointed out by her name, \"Toyosatomimi\". Because of this ability Miko's ears are extremely sensitive, leading her to wear earmuffs. Miko, who is from a high noble family, has from a young age heard many grumbles from government officials around her. Although one would think that nobody is usually able to understand such government officials, she understood all of it, and was able to give precise instructions to them. The aforementioned thus became a rumour that spread throughout society, and thus she gained tremendous popularity as a saint. In addition to this ability, which she acquired through the faith she had received as Prince Shoutoku while in her long slumber, gained the ability to hear other people's desires. By listening to the other's \"ten desires\" simultaneously, she gains insight into the personality, motives, and identities of whose desires she listens to, and thus is able to know everything about the other person; although, originally, such an act wasn't possible before.";
  const textLength = text.length * 9; //approximate pixel size for 32px font

  //if announcements are small, base the length of the marquee on the div instead of char count
  let marqueeLength: number;
  if (textLength > divWidth) {
    marqueeLength = textLength;
  } else {
    marqueeLength = divWidth;
  }
  const speed = marqueeLength / pxps;
  //const w = divRef === null ? 100 : divRef.scrollWidth;

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
