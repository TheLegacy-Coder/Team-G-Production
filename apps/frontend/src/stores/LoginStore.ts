import { DispatchWithoutAction } from "react";

class LoginStore {
  public loggedIn: boolean;
  public from: string;
  public loginType: string;
  public navbarRefreshHook: DispatchWithoutAction | undefined = undefined;
  constructor() {
    this.loggedIn = false;
    this.from = "/";
    this.loginType = "user";
  }

  public login(loginType: string) {
    this.loginType = loginType;
    this.loggedIn = true;
    this.navbarRefreshHook?.();
  }
}

export const loginStore = new LoginStore();
