import React, { ReactNode } from "react";
import { contextMenuState } from "../stores/ContextMenuState.ts";

export interface ContextMenuRouterButtonProps {
  content: ReactNode;
  lable: string;
}

export function ContextMenuRouterButton(props: ContextMenuRouterButtonProps) {
  function route() {
    contextMenuState.update(props.content);
  }

  return <button onClick={route}>{props.lable}</button>;
}
