import React from "react";
import ResourceButton from "../components/ResourceButton.tsx";
import { HomeAnnounce } from "../components/HomeAnnounce.tsx";
const image = new Image();
image.src = "bh_bwh_pms_293.png";
import Stack from "react-bootstrap/Stack";

// import ExampleComponent from "../components/ExampleComponent.tsx";

export default function ExampleRoute() {
  return (
    <div className="w-100 h-100 d-flex flex-row overflow-auto">
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

      {/*{<ExampleComponent />}*/}
    </div>
  );
}

/*

import React from "react";
import {ExampleComponent} from "../components/ExampleComponent.tsx";

export default function ExampleRoute() {
  return (
    <div className="w-100 h-100 d-flex flex-column overflow-auto">


      <h1>This is not an example page.</h1>
        <ExampleComponent></ExampleComponent>
    </div>
  );
}

 */
