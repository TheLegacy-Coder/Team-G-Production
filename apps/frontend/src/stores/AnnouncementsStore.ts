import axios, { AxiosResponse } from "axios";

export interface Announcement {
  announcementID: string;
  desc: string;
  requester: string;
  emergency: boolean;
}

export let announcements: Announcement[] = [];
refreshAnnouncements();
export function refreshAnnouncements() {
  axios
    .get("http://localhost:3000/api/announcements")
    .then((response: AxiosResponse<Announcement[]>) => {
      console.log(response.data);
      announcements = response.data;
    });
}
