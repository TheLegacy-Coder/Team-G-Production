import axios from "axios";
import { currentToken } from "../stores/LoginStore.ts";

export function getAnnouncementsAxios() {
  return axios.get("http://localhost:3000/api/announcements", {
    headers: { Authorization: `Bearer ${currentToken}` },
  });
}
