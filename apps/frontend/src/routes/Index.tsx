import React from "react";

import { ContextMenu } from "../components/ContextMenu.tsx";
import { InteractableMap } from "./InteractableMap.tsx";
import { HomeAnnounce } from "../components/HomeAnnounce.tsx";
import LocationDropdown from "../components/LocationDropdown.tsx";

export const Index = () => {
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <ContextMenu />
      <InteractableMap />
      <HomeAnnounce />
      <LocationDropdown />
    </div>
  );
};

/*

<div>
        <br />
        <img
          style={{ margin: "20px" }}
          src="bh_bwh_pms_293.png"
          alt="hospital logo"
          width="680"
          height="200"
        />
        <br />
        <br />
        <Stack style={{ margin: "16px" }} direction="horizontal" gap={3}>
          <ResourceButton value="Appointment Scheduling" />
          <ResourceButton value="Patient Records" />
          <ResourceButton value="Staff Directories" />
        </Stack>
        <br />
        <HomeAnnounce />
        <br />
      </div>

      <div>
        <div>
          <b>
            <u>L1 Floor Map:</u>
          </b>
        </div>
        <img
          src="00_thelowerlevel1.png"
          alt="l1 floor map"
          width="700"
          height="550"
        />
      </div>
 */
