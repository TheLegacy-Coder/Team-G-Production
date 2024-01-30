import React, { useReducer } from "react";
import { contextMenuState } from "../stores/ContextMenuState.ts";

export function ContextMenu() {
  //What not having mobX has reduced me to
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  contextMenuState.render = forceUpdate;
  return (
    <div className={contextMenuState.showingClass} style={{ display: "flex" }}>
      <div className={"context-menu-divider-button"} style={{ flex: "10px" }}>
        <button
          className={"context-menu-button"}
          onClick={() => {
            contextMenuState.toggle();
          }}
        >
          {contextMenuState.showing ? ">" : "<"}
        </button>
      </div>
      <div className={"context-menu-divider-pad"} style={{ flex: "5%" }} />
      <div
        className={
          contextMenuState.reSelect == 0
            ? "context-menu-divider-content"
            : contextMenuState.reSelect == 1
              ? "context-menu-divider-content-reselect"
              : "context-menu-divider-content-reselect-alt"
        }
        style={{ flex: "80%" }}
      >
        <div className={"context-menu-title-box"}>
          <h1 className={"context-menu-title"}>{contextMenuState.title}</h1>
        </div>
        {contextMenuState.window}
      </div>
    </div>
  );
}
