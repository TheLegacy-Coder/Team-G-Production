import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { Prisma } from "database";

const router: Router = express.Router();

// router.post("/", async function (req: Request, res: Response) {
//   const highScoreAttempt: Prisma.HighScoreCreateInput = req.body;
//   // Attempt to save the high score
//   try {
//     // Attempt to create in the database
//     await PrismaClient.highScore.create({ data: highScoreAttempt });
//     console.info("Successfully saved high score attempt"); // Log that it was successful
//   } catch (error) {
//     // Log any failures
//     console.error(
//       `Unable to save high score attempt ${highScoreAttempt}: ${error}`,
//     );
//     res.sendStatus(400); // Send error
//     return; // Don't try to send duplicate statuses
//   }
//
//   res.sendStatus(200); // Otherwise say it's fine
// });

// Whenever a get request is made, return the high score
router.get("/requests", async function (req: Request, res: Response) {
  console.log("req");
  const getAll = req.query.getall;
  const employeeID = req.query.employeeID;
  console.log(getAll);
  console.log(employeeID);
  // Fetch the high score from Prisma

  if (getAll == "true") {
    const serviceRequest = await PrismaClient.serviceRequest.findMany({
      orderBy: { time: "desc" },
    });
    // If the high score doesn't exist
    if (serviceRequest === null) {
      // Log that (it's a problem)
      console.error("No Service Requests found in database!");
      res.sendStatus(204); // and send 204, no data
    } else {
      // Otherwise, send the score
      res.send(serviceRequest);
    }
  } else {
    const serviceRequest = await PrismaClient.serviceRequest.findMany({
      orderBy: { time: "desc" },
      where: { helpingEmployee: employeeID as string },
    });
    // If the high score doesn't exist
    if (serviceRequest === null) {
      // Log that (it's a problem)
      console.error("No Service Requests found!");
      res.sendStatus(204); // and send 204, no data
    } else {
      // Otherwise, send the score
      res.send(serviceRequest);
    }
  }
});

router.post("/requests", async function (req: Request, res: Response) {
  console.log("req");
  const requestAttempt: Prisma.ServiceRequestCreateInput = req.body;
  console.log(req.body);
  try {
    await PrismaClient.serviceRequest.create({ data: requestAttempt });
    console.log("Successfully created Service Request");
  } catch (error) {
    console.error("Unable to create Service Request");
    console.log(error);
    res.sendStatus(204);
    return;
  }

  res.sendStatus(200);
});

router.patch("/requests", async function (req: Request, res: Response) {
  console.log("patch");
  try {
    await PrismaClient.serviceRequest.update({
      where: { requestID: req.body.requestID },
      data: { status: req.body.status },
    });
    console.log(
      "Updated " + req.body.requestID + " to status " + req.body.status,
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(204);
    return;
  }
});

export default router;
