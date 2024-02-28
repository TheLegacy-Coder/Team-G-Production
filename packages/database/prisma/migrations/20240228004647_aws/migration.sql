-- CreateTable
CREATE TABLE "Employee" (
    "employeeID" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "accessLevel" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeID")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "requestID" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requester" TEXT,
    "helpingEmployee" TEXT,
    "desc" TEXT NOT NULL,
    "time" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("requestID")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "announcementID" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "requester" TEXT,
    "emergency" BOOLEAN NOT NULL,
    "time" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcenments_pkey" PRIMARY KEY ("announcementID")
);

-- CreateTable
CREATE TABLE "Edge" (
    "edgeID" TEXT NOT NULL,
    "startNode" TEXT NOT NULL,
    "endNode" TEXT NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("edgeID")
);

-- CreateTable
CREATE TABLE "Node" (
    "nodeID" TEXT NOT NULL,
    "xcoord" INTEGER NOT NULL,
    "ycoord" INTEGER NOT NULL,
    "floor" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "longName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("nodeID")
);

-- CreateTable
CREATE TABLE "ServiceRequestExternalTransport" (
    "requestID" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "destination" TEXT NOT NULL,

    CONSTRAINT "ServiceRequestExternalTransport_pkey" PRIMARY KEY ("requestID")
);

-- CreateTable
CREATE TABLE "ServiceRequestFlowers" (
    "requestID" TEXT NOT NULL,
    "flowerType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "ServiceRequestFlowers_pkey" PRIMARY KEY ("requestID")
);

-- CreateTable
CREATE TABLE "ServiceRequestInterpreter" (
    "requestID" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "ServiceRequestInterpreter_pkey" PRIMARY KEY ("requestID")
);

-- CreateTable
CREATE TABLE "ServiceRequestReligious" (
    "requestID" TEXT NOT NULL,
    "faith" TEXT NOT NULL,

    CONSTRAINT "ServiceRequestReligious_pkey" PRIMARY KEY ("requestID")
);

-- CreateTable
CREATE TABLE "ServiceRequestSanitation" (
    "requestID" TEXT NOT NULL,
    "hazardous" BOOLEAN NOT NULL,
    "messType" TEXT NOT NULL,

    CONSTRAINT "ServiceRequestSanitation_pkey" PRIMARY KEY ("requestID")
);

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_fk1" FOREIGN KEY ("location") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_fk2" FOREIGN KEY ("helpingEmployee") REFERENCES "Employee"("employeeID") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_fk3" FOREIGN KEY ("requester") REFERENCES "Employee"("employeeID") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_fk1" FOREIGN KEY ("requester") REFERENCES "Employee"("employeeID") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_fk1" FOREIGN KEY ("startNode") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_fk2" FOREIGN KEY ("endNode") REFERENCES "Node"("nodeID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServiceRequestExternalTransport" ADD CONSTRAINT "ServiceRequestExternalTransport_fk1" FOREIGN KEY ("requestID") REFERENCES "ServiceRequest"("requestID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServiceRequestFlowers" ADD CONSTRAINT "ServiceRequestFlowers_fk1" FOREIGN KEY ("requestID") REFERENCES "ServiceRequest"("requestID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServiceRequestInterpreter" ADD CONSTRAINT "ServiceRequestInterpreter" FOREIGN KEY ("requestID") REFERENCES "ServiceRequest"("requestID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServiceRequestReligious" ADD CONSTRAINT "ServiceRequestReligious_fk1" FOREIGN KEY ("requestID") REFERENCES "ServiceRequest"("requestID") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServiceRequestSanitation" ADD CONSTRAINT "ServiceRequestSanitation_fk1" FOREIGN KEY ("requestID") REFERENCES "ServiceRequest"("requestID") ON DELETE CASCADE ON UPDATE NO ACTION;
