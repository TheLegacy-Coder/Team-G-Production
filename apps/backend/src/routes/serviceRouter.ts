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
  // Fetch the high score from Prisma
  const node = await PrismaClient.serviceRequest.findMany();

  // If the high score doesn't exist
  if (node === null) {
    // Log that (it's a problem)
    console.error("No nodes found in database!");
    res.sendStatus(204); // and send 204, no data
  } else {
    // Otherwise, send the score
    res.send(node);
  }
});

router.post("/requests", async function (req: Request, res: Response) {
  console.log("req");
  const requestAttempt: Prisma.ServiceRequestCreateInput = req.body;

  try {
    await PrismaClient.serviceRequest.create({ data: requestAttempt });
    console.log("Successfully created Service Request");
  } catch (error) {
    console.error("Unable to create Service Request");
    res.sendStatus(204);
    return;
  }

  res.sendStatus(200);
});

export default router;
