import React, { useReducer } from "react";
import { contextMenuState } from "../stores/ContextMenuState.ts";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { ServiceRequests } from "./ServiceRequests.tsx";
import { Login } from "../routes/Login.tsx";
import { loginStore } from "../stores/LoginStore.ts";
import "./styles/ContextMenu.css";
import { Csvs } from "../routes/Csvs.tsx";
import { ViewRequests } from "../routes/ViewRequests.tsx";

export function ContextMenu() {
  //What not having mobX has reduced me to
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  loginStore.navbarRefreshHook = forceUpdate;
  contextMenuState.render = forceUpdate;
  return (
    <div className={contextMenuState.showingClass} style={{ display: "flex" }}>
      <div className={"context-menu-nav"}>
        <div
          className={"context-menu-toggle"}
          onClick={() => {
            contextMenuState.toggle();
          }}
        >
          {contextMenuState.showing ? "→" : "←"}
        </div>
        <ContextMenuRouterButton
          content={<div>placeholder</div>}
          lable={"Help"}
          protected={false}
          style={"context-menu-tab"}
        />

        <ContextMenuRouterButton
          content={<Login />}
          lable={"Login"}
          style={"context-menu-tab"}
        />

        <ContextMenuRouterButton
          content={<ServiceRequests />}
          lable={"Service Request"}
          protected={true}
          style={"context-menu-tab"}
        />

        {(loginStore.loginType === "admin" ||
          loginStore.loginType === "staff") &&
        loginStore.loggedIn ? (
          <>
            {loginStore.loginType === "admin" ? (
              <>
                <ContextMenuRouterButton
                  content={<Csvs />}
                  lable={"Nodes & Edges"}
                  protected={true}
                  admin={true}
                  style={"context-menu-tab-admin"}
                />
              </>
            ) : (
              <></>
            )}
            <ContextMenuRouterButton
              content={<ViewRequests />}
              lable={"Service Requests"}
              protected={true}
              admin={true}
              style={"context-menu-tab-admin"}
            />
          </>
        ) : (
          <></>
        )}
      </div>
      <div
        className={
          contextMenuState.reSelect == 0
            ? "context-menu-divider-content"
            : contextMenuState.reSelect == 1
              ? "context-menu-divider-content-reselect"
              : "context-menu-divider-content-reselect-alt"
        }
        style={{ flex: "500px" }}
      >
        <div className={"context-menu-title-box"}>
          <h1 className={"context-menu-title"}>{contextMenuState.title}</h1>
        </div>
        {contextMenuState.window}
      </div>
    </div>
  );
}
