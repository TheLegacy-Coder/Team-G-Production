import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/Profile.css";
import { currentProfile } from "../stores/LoginStore.ts";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </button>
  );
};

const EditProfileButton = () => {
  return (
    <button
      onClick={() => {
        window.location; //change to actual edit profile options
      }}
    >
      Edit Profile
    </button>
  );
};

export const Profile = () => {
  // const { user, isAuthenticated } = useAuth0(); //user an isAuthenticated dont change to true
  console.log(currentProfile);
  return (
    /*isAuthenticated && user ? */ <div className={"profile-buttons"}>
      {/*<img src={user.picture} alt={user.name} />*/}
      {/*<h2>{user.name}</h2>*/}
      {/*<p>{user.email}</p>*/}

      <img
        src={
          currentProfile === undefined
            ? "https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
            : currentProfile.picture
        }
      />
      <EditProfileButton />
      <LogoutButton />
    </div> /*: null*/
  );
};
