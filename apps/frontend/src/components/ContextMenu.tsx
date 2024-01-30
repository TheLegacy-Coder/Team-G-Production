import React, { useReducer } from "react";
import { contextMenuState } from "../stores/ContextMenuState.ts";

export function ContextMenu() {
  //What not having mobX has reduced me to
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  contextMenuState.render = forceUpdate;
  return (
    <div
      className={
        !contextMenuState.showing ? "context-menu-out" : "context-menu-in"
      }
      style={{ display: "flex" }}
    >
      <div className={"context-menu-divider-button"} style={{ flex: "10px" }}>
        <button
          style={{
            width: "100%",
            height: "80%",
            top: "10%",
            position: "relative",
          }}
          onClick={() => {
            contextMenuState.toggle();
          }}
        ></button>
      </div>
      <div className={"context-menu-divider-pad"} style={{ flex: "5%" }} />
      <div className={"context-menu-divider-content"} style={{ flex: "80%" }}>
        {contextMenuState.window}
      </div>
    </div>
  );
}
