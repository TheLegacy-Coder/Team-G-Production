import express, { Router, Request, Response } from "express";
import PrismaClient from "../bin/database-connection.ts";
import { Prisma } from "database";
import {
  ServiceRequestFlowers,
  ServiceRequest,
  ServiceRequestReligious,
  ServiceRequestSanitation,
  ServiceRequestInterpreter,
  ServiceRequestExternalTransport,
  AllServiceRequests,
} from "common/src/ServiceRequests.ts";

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
  const getAll = req.query.getAll;
  const employeeID = req.query.employeeID;
  console.log(getAll);
  console.log(employeeID);
  // Fetch the high score from Prisma
  console.log(getAll === "true");
  if (getAll === "true") {
    const serviceRequestCore = await PrismaClient.serviceRequest.findMany({
      orderBy: { time: "desc" },
    });

    const serviceRequestFlowers =
      await PrismaClient.serviceRequestFlowers.findMany({});

    const serviceRequestInterpreter =
      await PrismaClient.serviceRequestInterpreter.findMany({});

    const serviceRequestReligious =
      await PrismaClient.serviceRequestReligious.findMany({});

    const serviceRequestSanitation =
      await PrismaClient.serviceRequestSanitation.findMany({});

    const serviceRequestExternalTransport =
      await PrismaClient.serviceRequestExternalTransport.findMany({});

    const flowers: ServiceRequestFlowers[] = [];
    const interpreter: ServiceRequestInterpreter[] = [];
    const religious: ServiceRequestReligious[] = [];
    const sanitation: ServiceRequestSanitation[] = [];
    const transport: ServiceRequestExternalTransport[] = [];

    serviceRequestFlowers.forEach((req) => {
      const core = serviceRequestCore.find((core) => {
        return core.requestID === req.requestID;
      });
      if (core !== undefined) {
        flowers.push({
          amount: req.amount,
          desc: core.desc,
          flowerType: req.flowerType as
            | "Roses"
            | "Daisies"
            | "Orchids"
            | "Tulips",
          helpingEmployee: core.helpingEmployee,
          location: core.location,
          priority: core.priority as "Low" | "Medium" | "High" | "Emergency",
          requestID: core.requestID,
          requestType: core.requestType as
            | "Flowers"
            | "Religious"
            | "Sanitation"
            | "Interpreter"
            | "Transport",
          requester: core.requester as string,
          status: core.status as "Assigned" | "In Progress" | "Completed",
          time: core.time?.toLocaleString(),
        });
      }
    });

    serviceRequestInterpreter.forEach((req) => {
      const core = serviceRequestCore.find((core) => {
        return core.requestID === req.requestID;
      });
      if (core !== undefined) {
        interpreter.push({
          language: req.language as
            | "Spanish"
            | "Mandarin"
            | "French"
            | "ASL"
            | "Russian"
            | "Japanese"
            | "Arabic",
          desc: core.desc,
          helpingEmployee: core.helpingEmployee,
          location: core.location,
          priority: core.priority as "Low" | "Medium" | "High" | "Emergency",
          requestID: core.requestID,
          requestType: core.requestType as
            | "Flowers"
            | "Religious"
            | "Sanitation"
            | "Interpreter"
            | "Transport",
          requester: core.requester as string,
          status: core.status as "Assigned" | "In Progress" | "Completed",
          time: core.time?.toLocaleString(),
        });
      }
    });

    serviceRequestSanitation.forEach((req) => {
      const core = serviceRequestCore.find((core) => {
        return core.requestID === req.requestID;
      });
      if (core !== undefined) {
        sanitation.push({
          messType: req.messType as
            | "Vomit"
            | "Blood"
            | "Excrement"
            | "Spill"
            | "Other",
          hazardous: req.hazardous,
          desc: core.desc,
          helpingEmployee: core.helpingEmployee,
          location: core.location,
          priority: core.priority as "Low" | "Medium" | "High" | "Emergency",
          requestID: core.requestID,
          requestType: core.requestType as
            | "Flowers"
            | "Religious"
            | "Sanitation"
            | "Interpreter"
            | "Transport",
          requester: core.requester as string,
          status: core.status as "Assigned" | "In Progress" | "Completed",
          time: core.time?.toLocaleString(),
        });
      }
    });

    serviceRequestReligious.forEach((req) => {
      const core = serviceRequestCore.find((core) => {
        return core.requestID === req.requestID;
      });
      if (core !== undefined) {
        religious.push({
          faith: req.faith as
            | "Christianity"
            | "Judaism"
            | "Islam"
            | "Hinduism"
            | "Buddhism",
          desc: core.desc,
          helpingEmployee: core.helpingEmployee,
          location: core.location,
          priority: core.priority as "Low" | "Medium" | "High" | "Emergency",
          requestID: core.requestID,
          requestType: core.requestType as
            | "Flowers"
            | "Religious"
            | "Sanitation"
            | "Interpreter"
            | "Transport",
          requester: core.requester as string,
          status: core.status as "Assigned" | "In Progress" | "Completed",
          time: core.time?.toLocaleString(),
        });
      }
    });

    serviceRequestExternalTransport.forEach((req) => {
      const core = serviceRequestCore.find((core) => {
        return core.requestID === req.requestID;
      });
      if (core !== undefined) {
        transport.push({
          vehicle: req.vehicle as "Helicopter" | "Ambulance" | "Car",
          destination: req.destination,
          desc: core.desc,
          helpingEmployee: core.helpingEmployee,
          location: core.location,
          priority: core.priority as "Low" | "Medium" | "High" | "Emergency",
          requestID: core.requestID,
          requestType: core.requestType as
            | "Flowers"
            | "Religious"
            | "Sanitation"
            | "Interpreter"
            | "Transport",
          requester: core.requester as string,
          status: core.status as "Assigned" | "In Progress" | "Completed",
          time: core.time?.toLocaleString(),
        });
      }
    });

    const payload: AllServiceRequests = {
      flowers: flowers,
      interpreter: interpreter,
      religious: religious,
      sanitation: sanitation,
      transport: transport,
    };

    if (payload === null) {
      // Log that (it's a problem)
      console.error("No Service Requests found in database!");
      res.sendStatus(204); // and send 204, no data
    } else {
      // Otherwise, send the score
      res.send(payload);
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

//SERVICE REQUEST POSTS
router.post("/requests/flowers", async function (req: Request, res: Response) {
  console.log("req");

  try {
    const requestFull = req.body as ServiceRequestFlowers;
    const coreRequest: ServiceRequest = {
      desc: requestFull.desc,
      helpingEmployee:
        requestFull.helpingEmployee === undefined
          ? null
          : requestFull.helpingEmployee,
      location: requestFull.location,
      requestID: requestFull.requestID,
      requestType: requestFull.requestType,
      requester: requestFull.requester,
      status: requestFull.status,
      priority: requestFull.priority,
    };
    await PrismaClient.serviceRequest.create({
      data: coreRequest as Prisma.ServiceRequestUncheckedCreateInput,
    });
    await PrismaClient.serviceRequestFlowers.create({
      data: {
        requestID: coreRequest.requestID,
        amount: requestFull.amount,
        flowerType: requestFull.flowerType,
      } as Prisma.ServiceRequestFlowersUncheckedCreateInput,
    });

    console.log("Successfully created Service Request");
  } catch (error) {
    console.error("Unable to create Service Request");
    console.log(error);
    res.sendStatus(204);
    return;
  }

  res.sendStatus(200);
});

router.post(
  "/requests/religious",
  async function (req: Request, res: Response) {
    console.log("req");

    try {
      const requestFull = req.body as ServiceRequestReligious;
      const coreRequest: ServiceRequest = {
        desc: requestFull.desc,
        helpingEmployee:
          requestFull.helpingEmployee === undefined
            ? null
            : requestFull.helpingEmployee,
        location: requestFull.location,
        requestID: requestFull.requestID,
        requestType: requestFull.requestType,
        requester: requestFull.requester,
        status: requestFull.status,
        priority: requestFull.priority,
      };
      await PrismaClient.serviceRequest.create({
        data: coreRequest as Prisma.ServiceRequestUncheckedCreateInput,
      });
      await PrismaClient.serviceRequestReligious.create({
        data: {
          requestID: coreRequest.requestID,
          faith: requestFull.faith,
        } as Prisma.ServiceRequestReligiousUncheckedCreateInput,
      });

      console.log("Successfully created Service Request");
    } catch (error) {
      console.error("Unable to create Service Request");
      console.log(error);
      res.sendStatus(204);
      return;
    }

    res.sendStatus(200);
  },
);

router.post(
  "/requests/sanitation",
  async function (req: Request, res: Response) {
    console.log("req");

    try {
      const requestFull = req.body as ServiceRequestSanitation;
      const coreRequest: ServiceRequest = {
        desc: requestFull.desc,
        helpingEmployee:
          requestFull.helpingEmployee === undefined
            ? null
            : requestFull.helpingEmployee,
        location: requestFull.location,
        requestID: requestFull.requestID,
        requestType: requestFull.requestType,
        requester: requestFull.requester,
        status: requestFull.status,
        priority: requestFull.priority,
      };
      await PrismaClient.serviceRequest.create({
        data: coreRequest as Prisma.ServiceRequestUncheckedCreateInput,
      });
      await PrismaClient.serviceRequestSanitation.create({
        data: {
          requestID: coreRequest.requestID,
          hazardous: requestFull.hazardous,
          messType: requestFull.messType,
        } as Prisma.ServiceRequestSanitationUncheckedCreateInput,
      });

      console.log("Successfully created Service Request");
    } catch (error) {
      console.error("Unable to create Service Request");
      console.log(error);
      res.sendStatus(204);
      return;
    }

    res.sendStatus(200);
  },
);

router.post(
  "/requests/interpreter",
  async function (req: Request, res: Response) {
    console.log("req");

    try {
      const requestFull = req.body as ServiceRequestInterpreter;
      const coreRequest: ServiceRequest = {
        desc: requestFull.desc,
        helpingEmployee:
          requestFull.helpingEmployee === undefined
            ? null
            : requestFull.helpingEmployee,
        location: requestFull.location,
        requestID: requestFull.requestID,
        requestType: requestFull.requestType,
        requester: requestFull.requester,
        status: requestFull.status,
        priority: requestFull.priority,
      };
      await PrismaClient.serviceRequest.create({
        data: coreRequest as Prisma.ServiceRequestUncheckedCreateInput,
      });
      await PrismaClient.serviceRequestInterpreter.create({
        data: {
          requestID: coreRequest.requestID,
          language: requestFull.language,
        } as Prisma.ServiceRequestInterpreterUncheckedCreateInput,
      });

      console.log("Successfully created Service Request");
    } catch (error) {
      console.error("Unable to create Service Request");
      console.log(error);
      res.sendStatus(204);
      return;
    }

    res.sendStatus(200);
  },
);

router.post(
  "/requests/transport",
  async function (req: Request, res: Response) {
    console.log("req");

    try {
      const requestFull = req.body as ServiceRequestExternalTransport;
      const coreRequest: ServiceRequest = {
        desc: requestFull.desc,
        helpingEmployee:
          requestFull.helpingEmployee === undefined
            ? null
            : requestFull.helpingEmployee,
        location: requestFull.location,
        requestID: requestFull.requestID,
        requestType: requestFull.requestType,
        requester: requestFull.requester,
        status: requestFull.status,
        priority: requestFull.priority,
      };
      await PrismaClient.serviceRequest.create({
        data: coreRequest as Prisma.ServiceRequestUncheckedCreateInput,
      });
      await PrismaClient.serviceRequestExternalTransport.create({
        data: {
          requestID: coreRequest.requestID,
          vehicle: requestFull.vehicle,
          destination: requestFull.destination,
        } as Prisma.ServiceRequestExternalTransportUncheckedCreateInput,
      });

      console.log("Successfully created Service Request");
    } catch (error) {
      console.error("Unable to create Service Request");
      console.log(error);
      res.sendStatus(204);
      return;
    }

    res.sendStatus(200);
  },
);

router.post("/requests", async function (req: Request, res: Response) {
  console.log("req");
  const requestAttempt: Prisma.ServiceRequestUncheckedCreateInput = req.body;
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
