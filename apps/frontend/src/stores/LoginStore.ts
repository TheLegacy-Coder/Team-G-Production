class LoginStore {
  public loggedIn: boolean;
  public from: string;
  constructor() {
    this.loggedIn = false;
    this.from = "/";
  }
}

export const loginStore = new LoginStore();
