import React, { useReducer } from "react";
import { contextMenuState } from "../stores/ContextMenuState.ts";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { ServiceRequests } from "./ServiceRequests.tsx";
import { Login } from "../routes/Login.tsx";
import { loginStore } from "../stores/LoginStore.ts";
import "./styles/ContextMenu.css";
import { Csvs } from "../routes/Csvs.tsx";
import { ViewRequests } from "../routes/ViewRequests.tsx";
import { ViewEmployees } from "../routes/ViewEmployees.tsx";
import { About } from "./About.tsx";
import { HelpPage } from "./HelpPage.tsx";
import LocationDropdown from "./LocationDropdown.tsx";
import { Profile } from "./Profile.tsx";

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
          content={<About />}
          lable={"About"}
          protected={false}
          style={"context-menu-tab"}
        />

        <ContextMenuRouterButton
          content={<HelpPage />}
          lable={"Help"}
          protected={false}
          style={"context-menu-tab"}
        />

        {loginStore.loggedIn ? (
          // Render Profile button when logged in
          <ContextMenuRouterButton
            content={<Profile />}
            lable={"Profile"}
            protected={false}
            style={"context-menu-tab"}
          />
        ) : (
          // Render Login button when logged out
          <ContextMenuRouterButton
            content={<Login />}
            lable={"Login"}
            style={"context-menu-tab"}
          />
        )}

        <ContextMenuRouterButton
          content={<LocationDropdown />}
          lable={"Location Dropdown"}
          style={"context-menu-tab"}
        />

        <ContextMenuRouterButton
          content={<ServiceRequests />}
          lable={"Make Service Request"}
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
                <ContextMenuRouterButton
                  content={<ViewEmployees />}
                  lable={"Employees"}
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
              lable={"View Requests"}
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
