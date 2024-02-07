import { DispatchWithoutAction } from "react";
//import { Auth0Lock } from 'auth0-lock';

// Initializing our Auth0Lock
// @ts-expect-error this will complain about no import but it runs due to index.html includes
export const lock = new Auth0Lock(
  "6pLipx9nvYgidSSoiuodUl23OMScUmgU",
  "dev-1uv1d12i66i3umpd.us.auth0.com",
  {
    container: "lock-container",
    theme: {
      logo: "https://cpdlearn.massgeneralbrigham.org/app/uploads/2022/09/cropped-favicon.png",
      primaryColor: "#7089a2",
      foregroundColor: "#b8c4d1",
    },
  },
);

export let currentProfile = undefined;
export let currentToken = undefined;
// @ts-expect-error this will complain about no import but it runs due to index.html includes
lock.on("authenticated", function (authResult) {
  // Use the token in authResult to getUserInfo() and save it if necessary
  console.log(
    // @ts-expect-error this will complain about no import but it runs due to index.html includes
    lock.getUserInfo(authResult.accessToken, function (error, profile) {
      if (error) {
        // Handle error
        return;
      }
      currentToken = authResult.accessToken;
      console.log(profile);
      currentProfile = profile;

      //save Access Token only if necessary
      // privateStore.accessToken = accessToken;
      // privateStore.profile = profile;

      // Update DOM
    }),
  );
});

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
