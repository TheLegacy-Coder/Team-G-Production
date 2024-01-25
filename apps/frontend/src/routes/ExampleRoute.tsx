import React from "react";
import ResourceButton from "../components/ResourceButton.tsx";
import { HomeAnnounce } from "../components/HomeAnnounce.tsx";
const image = new Image();
image.src = "bh_bwh_pms_293.png";

// import ExampleComponent from "../components/ExampleComponent.tsx";

export default function ExampleRoute() {
  return (
    <div className="w-100 h-100 d-flex flex-column overflow-auto">
      <br />
      <img
        src="bh_bwh_pms_293.png"
        alt="hospital logo"
        width="680"
        height="200"
      />
      <br />
      <ResourceButton value="Appointment Scheduling" />
      <ResourceButton value="Patient Records" />
      <ResourceButton value="Staff Directories" />
      <br />
      <HomeAnnounce />

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
