import axios from "axios";
import { currentToken } from "../stores/LoginStore.ts";

export function getAnnouncementsAxios() {
  return axios.get(
    "https://ec2-18-221-74-82.us-east-2.compute.amazonaws.com/api/announcements",
    {
      headers: { Authorization: `Bearer ${currentToken}` },
    },
  );
}
