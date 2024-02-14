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

// const EditProfileButton = () => {
//   return (
//     <button
//       onClick={() => {
//         window.location; //change to actual edit profile options
//       }}
//     >
//       Edit Profile
//     </button>
//   );
// };

export const Profile = () => {
  return (
    <div className={"profile"}>
      <img
        src={
          currentProfile === undefined
            ? "https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
            : currentProfile.picture
        }
        alt={"profile picture"}
        style={{ width: "250px", height: "250px" }}
      />

      <h2>{currentProfile === undefined ? "" : currentProfile.name}</h2>

      <h3>{currentProfile === undefined ? "" : currentProfile.email}</h3>

      <div className={"profile-buttons"}>
        {/*<EditProfileButton />*/}
        <LogoutButton />
      </div>
    </div>
  );
};
