import React, { ReactNode } from "react";
import { contextMenuState } from "../stores/ContextMenuState.ts";
import { loginStore } from "../stores/LoginStore.ts";
import { Login } from "../routes/Login.tsx";
import { speechEngineBackend } from "../stores/SpeechEngineBackend.ts";
export interface ContextMenuRouterButtonProps {
  content: ReactNode;
  lable: string;
  protected?: boolean;
  style: string;
  customText?: string;
  admin?: boolean;
  button?: boolean;
}

export function ContextMenuRouterButton(props: ContextMenuRouterButtonProps) {
  function route() {
    const enable = props.protected == true ? loginStore.loggedIn : true;
    if (!enable) {
      contextMenuState.intendedPageTitle = props.lable;
      contextMenuState.intendedPage = props.content;
    }
    contextMenuState.update(
      enable ? props.content : <Login />,
      enable ? props.lable : "Login",
      props.admin === undefined ? false : props.admin,
    );
  }

  speechEngineBackend.RegisterCommand({
    command: `open ${props.lable}`,
    callback: () => {
      route();
    },
  });

  if (props.button === true) {
    return (
      <button
        className={
          props.style +
          (props.lable == contextMenuState.title ? "-selected" : "")
        }
        onClick={route}
      >
        {props.customText !== undefined ? props.customText : props.lable}
      </button>
    );
  } else {
    return (
      <div
        className={
          props.style +
          (props.lable == contextMenuState.title ? "-selected" : "")
        }
        onClick={route}
      >
        {props.customText !== undefined ? props.customText : props.lable}
      </div>
    );
  }
}
