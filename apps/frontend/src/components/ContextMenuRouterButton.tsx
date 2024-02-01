import React, { ReactNode } from "react";
import { contextMenuState } from "../stores/ContextMenuState.ts";
import "./styles/TopNavbar.css";
import { Nav } from "react-bootstrap";
import { loginStore } from "../stores/LoginStore.ts";
import { Login } from "../routes/Login.tsx";
export interface ContextMenuRouterButtonProps {
  content: ReactNode;
  lable: string;
  protected?: boolean;
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
    );
  }

  return (
    <Nav className={"nav-button"} onClick={route}>
      {props.lable}
    </Nav>
  );
}
