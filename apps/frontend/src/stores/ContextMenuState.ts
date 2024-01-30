import { ReactNode } from "react";

class ContextMenuState {
  public showing = false;
  public reSelect = 0;
  public window: ReactNode = undefined;
  public render: React.DispatchWithoutAction | undefined = undefined;
  public title = "Help";
  public showingClass: string = "context-menu-start";
  public intendedPage: ReactNode;
  public intendedPageTitle: string = "";
  // getContent() {
  //     switch (this.window) {
  //         case "":
  //             return <></>;
  //         case "login":
  //             return <Login />;
  //     }
  //     return <></>;
  // }

  loadIntendedPage() {
    if (this.intendedPage !== undefined && this.intendedPageTitle !== "") {
      this.update(this.intendedPage, this.intendedPageTitle);
    }
    this.intendedPage = undefined;
    this.intendedPageTitle = "";
  }
  update(content: ReactNode, title: string) {
    if (this.showing && this.title !== title) {
      this.reSelect = this.reSelect == 1 ? 2 : 1;
    }
    this.showing = true;
    this.window = content;
    this.title = title;
    this.showingClass = contextMenuState.showing
      ? "context-menu-in"
      : "context-menu-out";

    if (this.render != undefined) this.render();
  }

  toggle() {
    this.showing = !this.showing;
    this.showingClass = contextMenuState.showing
      ? "context-menu-in"
      : "context-menu-out";
    if (this.render != undefined) this.render();
  }
}

export const contextMenuState = new ContextMenuState();
