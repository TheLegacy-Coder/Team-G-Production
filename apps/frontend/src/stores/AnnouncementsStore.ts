import { AxiosResponse } from "axios";
import { getAnnouncementsAxios } from "../DataAsObject/announcementsAxios.ts";

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
  getAnnouncementsAxios().then((response: AxiosResponse<Announcement[]>) => {
    announcements = response.data;
    if (announcementsLength !== announcements.length) {
      announcementsChanged = true;
      announcementsLength = announcements.length;
    }
  });
}
