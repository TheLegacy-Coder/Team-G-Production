import React, { ReactNode } from "react";
import { contextMenuState } from "../stores/ContextMenuState.ts";
import "./styles/TopNavbar.css";
import { loginStore } from "../stores/LoginStore.ts";
import { Login } from "../routes/Login.tsx";
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
