import axios, { AxiosResponse } from "axios";

export type Announcement = {
  announcementID: string;
  desc: string;
  requester: string;
  emergency: boolean;
};

export let announcements: Announcement[] = [];
let announcementsLength = 0;

export let announcementsChanged = false;

export function clearAnnouncementFlag() {
  announcementsChanged = false;
}
refreshAnnouncements();
export function refreshAnnouncements() {
  axios
    .get("http://localhost:3000/api/announcements")
    .then((response: AxiosResponse<Announcement[]>) => {
      announcements = response.data;
      if (announcementsLength !== announcements.length) {
        announcementsChanged = true;
        announcementsLength = announcements.length;
      }
    });
}
