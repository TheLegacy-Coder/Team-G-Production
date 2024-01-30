import { ReactNode } from "react";

class ContextMenuState {
  public showing = false;
  public window: ReactNode = undefined;
  public render: React.DispatchWithoutAction | undefined = undefined;

  // getContent() {
  //     switch (this.window) {
  //         case "":
  //             return <></>;
  //         case "login":
  //             return <Login />;
  //     }
  //     return <></>;
  // }

  update(content: ReactNode) {
    this.showing = true;
    this.window = content;
    if (this.render != undefined) this.render();
  }

  toggle() {
    this.showing = !this.showing;
    if (this.render != undefined) this.render();
  }
}

export const contextMenuState = new ContextMenuState();
