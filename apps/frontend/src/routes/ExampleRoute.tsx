import React from "react";

// import ExampleComponent from "../components/ExampleComponent.tsx";
import Login from "../components/ExampleComponent.tsx";
import CloseProgram from "../components/CloseProgram.tsx";

export default function ExampleRoute() {
  return (
    <div className="w-100 h-100 d-flex flex-column overflow-auto">
      <h1>This is our login page.</h1>
      <Login /> {/* Add the login component */}
      {/*{<ExampleComponent />}*/}
      <CloseProgram /> {/* Add the CloseButton component */}
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
