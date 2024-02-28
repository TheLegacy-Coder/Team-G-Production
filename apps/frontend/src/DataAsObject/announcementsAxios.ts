import axios from "axios";
import { currentToken } from "../stores/LoginStore.ts";
import { link } from "./links.ts";

export function getAnnouncementsAxios() {
  return axios.get(link + "/api/announcements", {
    headers: { Authorization: `Bearer ${currentToken}` },
  });
}
