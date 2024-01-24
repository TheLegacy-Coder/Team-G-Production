import React from "react";
import ResourceButton from "../components/ResourceButton.tsx";

// import ExampleComponent from "../components/ExampleComponent.tsx";

export default function ExampleRoute() {
  return (
    <div className="w-100 h-100 d-flex flex-column overflow-auto">
      <h1>This is our home page.</h1>
      <ResourceButton value="Appointment Scheduling" />
      <ResourceButton value="Patient Records" />
      <ResourceButton value="Staff Directories" />

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
