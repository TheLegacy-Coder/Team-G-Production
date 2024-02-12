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
  public extended = false;
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
      this.update(this.intendedPage, this.intendedPageTitle, false);
    }
    this.intendedPage = undefined;
    this.intendedPageTitle = "";
  }
  update(content: ReactNode, title: string, admin: boolean) {
    if (this.showing && this.title !== title) {
      this.reSelect = this.reSelect == 1 ? 2 : 1;
    }

    const lastShowing = this.showing;
    this.showing = true;
    this.window = content;
    this.title = title;
    if (admin) {
      if (lastShowing) {
        if (!this.extended) {
          this.showingClass = "context-menu-in-to-long";
        }
      } else {
        this.showingClass = "context-menu-out-to-long";
      }
      this.extended = true;
    } else {
      if (lastShowing) {
        if (this.extended) {
          this.showingClass = "context-menu-long-to-in";
        }
      } else {
        this.showingClass = "context-menu-out-to-in";
      }
      this.extended = false;
    }

    if (this.render != undefined) this.render();
  }

  refresh() {
    if (this.render != undefined) this.render();
  }

  toggle() {
    this.showing = !this.showing;
    if (this.showing) {
      if (this.extended) {
        this.showingClass = "context-menu-out-to-long";
      } else {
        this.showingClass = "context-menu-out-to-in";
      }
    } else {
      if (this.extended) {
        this.showingClass = "context-menu-long-to-out";
      } else {
        this.showingClass = "context-menu-in-to-out";
      }
    }

    if (this.render != undefined) this.render();
  }
}

export const contextMenuState = new ContextMenuState();
