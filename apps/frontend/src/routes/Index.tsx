import React from "react";

import { ContextMenu } from "../components/ContextMenu.tsx";
import { InteractableMap } from "./InteractableMap.tsx";
import { HomeAnnounce } from "../components/HomeAnnounce.tsx";
import { SpeechEngine } from "../components/SpeechEngine.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { MapNav } from "./MapNav.tsx";
import { drawData } from "../map/DrawData.ts";
//import { drawData } from "../map/DrawData.ts";

export const Index = () => {
  return (
    <Auth0Provider
      clientId={"6pLipx9nvYgidSSoiuodUl23OMScUmgU"}
      domain={"dev-1uv1d12i66i3umpd.us.auth0.com"}
      authorizationParams={{
        redirectUri: window.location.origin,
      }}
    >
      <div style={{ position: "relative", height: "100%" }}>
        <SpeechEngine />
        <ContextMenu />

        <div
          id={"canvas-container"}
          style={
            {
              width: window.innerWidth - drawData.offset.x,
              height: window.innerHeight - drawData.offset.y,
              overflow: "hidden",
            } as React.CSSProperties
          }
        >
          <MapNav />
          <InteractableMap />
        </div>

        <HomeAnnounce />
      </div>
    </Auth0Provider>
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
