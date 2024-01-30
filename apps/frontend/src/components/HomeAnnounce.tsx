import React from "react";

export const HomeAnnounce = () => {
  return (
    <div className={"announcements-bar"}>
      <div className={"announcements-heading"}>
        <b>
          <u>Home Announcements:</u>
        </b>
      </div>
      <div className={"marquee"}>
        • Bob has been admitted after crashing his car into the hospital's front
        door • Staff Update: Wilson Wong has joined our team • Scrum Master
        Tommy Meet & Greet: 02/15/24 @ 3 PM
      </div>
    </div>
  );
};
