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
    .get(
      "https://ec2-18-221-74-82.us-east-2.compute.amazonaws.com/api/announcements",
    )
    .then((response: AxiosResponse<Announcement[]>) => {
      announcements = response.data;
      if (announcementsLength !== announcements.length) {
        announcementsChanged = true;
        announcementsLength = announcements.length;
      }
    });
}
