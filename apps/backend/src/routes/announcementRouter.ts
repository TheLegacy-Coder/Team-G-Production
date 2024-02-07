import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { Prisma } from "database";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  console.log("req");
  const announcement = await PrismaClient.announcement.findMany();

  if (announcement === null) {
    console.error("No announcements found in database!");
    res.sendStatus(204);
  } else {
    res.send(announcement);
  }
});

router.post("/", async function (req: Request, res: Response) {
  console.log("req");
  const requestAttempt: Prisma.AnnouncementCreateInput = req.body;

  try {
    await PrismaClient.announcement.create({ data: requestAttempt });
    console.log("Successfully created Announcement");
  } catch (error) {
    console.error("Unable to create Announcement");
    console.log(error);
    res.sendStatus(204);
    return;
  }

  res.sendStatus(200);
});

router.delete("/", async function (req: Request, res: Response) {
  console.log(req);

  try {
    await PrismaClient.announcement.delete({
      where: { announcementID: req.body.announcementID },
    });
    console.log("Successfully deleted Announcement");
  } catch (error) {
    console.error(
      "Announcement with ID " + req.body.announcementID + " not found!",
    );
    res.sendStatus(204);
    return;
  }
  res.sendStatus(200);
});
export default router;
