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
router.get("/", async function (req: Request, res: Response) {
  console.log("req");
  console.log(req.query.getAll); // string (true or false)
  // console.log((req.query.jobTypes as string).split(",")); // string[]
  let jobEmps;

  if (req.query.getAll === "true") {
    // Fetch all the employees from Prisma
    const allEmps = await PrismaClient.employee.findMany();
    // If employees don't exist
    if (allEmps === null) {
      // Log that (it's a problem)
      console.error("No employees found in database!");
      res.sendStatus(204); // and send 204, no data
      return;
    } else {
      // Otherwise, send the all
      res.send(allEmps);
      return;
    }
  }

  const jobTypes = (req.query.jobTypes as string).split(",");

  jobEmps = await PrismaClient.employee.findMany({
    where: { job: jobTypes[0] },
  });

  for (let i = 1; i < jobTypes.length; i++) {
    jobEmps = jobEmps.concat(
      await PrismaClient.employee.findMany({
        where: { job: jobTypes[i] },
      }),
    );
  }

  // Fetch the employees of the given job type from Prisma
  // const jobEmps = await PrismaClient.employee.findMany({
  //   where: { job: jobTypes[0] },
  // });

  // If employees don't exist
  if (jobEmps === null) {
    // Log that (it's a problem)
    console.error("No employees found in database!");
    res.sendStatus(204); // and send 204, no data
    return;
  } else {
    // Otherwise, send the employees
    res.send(jobEmps);
    return;
  }
});

router.post("/", async function (req: Request, res: Response) {
  console.log("req");
  const empAttempt: Prisma.EmployeeCreateInput = req.body;

  try {
    await PrismaClient.employee.create({ data: empAttempt });
    console.log("Successfully created Employee");
  } catch (error) {
    console.error("Unable to create Employee");
    res.sendStatus(204);
    return;
  }

  res.sendStatus(200);
});

router.delete("/", async function (req: Request, res: Response) {
  console.log("req");

  try {
    await PrismaClient.employee.delete({
      where: { employeeID: req.body.employeeID },
    });
    console.log("Successfully deleted Employee" + req.body.employeeID);
  } catch (error) {
    console.error("Employee with ID " + req.body.employeeID + " not found!");
    res.sendStatus(204);
    return;
  }

  res.sendStatus(200);
});

export default router;
