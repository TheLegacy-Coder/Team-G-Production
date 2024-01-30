import React from "react";
import Stack from "react-bootstrap/Stack";

import { ResourceButton } from "../components/ResourceButton.tsx";
import { HomeAnnounce } from "../components/HomeAnnounce.tsx";
import { ContextMenu } from "../components/ContextMenu.tsx";

export const Index = () => {
  return (
    <div
      className="w-100 h-100 d-flex flex-row overflow-auto"
      style={{ position: "relative", height: "100%" }}
    >
      <ContextMenu />
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
    </div>
  );
};
