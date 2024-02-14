--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;


--
-- Name: Node; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."Node" (
    "nodeID" text NOT NULL, --primary Key
    xcoord integer NOT NULL,
    ycoord integer NOT NULL,
    floor text NOT NULL,
    building text NOT NULL,
    "nodeType" text NOT NULL,
    "longName" text NOT NULL,
    "shortName" text NOT NULL
);


--ALTER TABLE dev."Node" OWNER TO dev;

--
-- Name: ; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."Edge" (
    "edgeID" text NOT NULL, --Primary Key,
    "startNode" text NOT NULL, --references dev."Node"("nodeID")
    "endNode" text NOT NULL --references dev."Node"("nodeID")
);


--ALTER TABLE dev."Edge" OWNER TO dev;



--
-- Data for Name: Edge; Type: TABLE DATA; Schema: dev; Owner: dev
--

INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CCONF002L1_WELEV00HL1', 'CCONF002L1', 'WELEV00HL1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CCONF003L1_CHALL002L1', 'CCONF003L1', 'CHALL002L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CDEPT002L1_CDEPT003L1', 'CDEPT002L1', 'CDEPT003L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CDEPT003L1_CHALL014L1', 'CDEPT003L1', 'CHALL014L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CDEPT004L1_CHALL002L1', 'CDEPT004L1', 'CHALL002L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL001L1_CREST001L1', 'CHALL001L1', 'CREST001L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL002L1_CSERV001L1', 'CHALL002L1', 'CSERV001L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL003L1_CCONF003L1', 'CHALL003L1', 'CCONF003L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL003L1_CLABS004L1', 'CHALL003L1', 'CLABS004L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL004L1_CREST004L1', 'CHALL004L1', 'CREST004L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL005L1_WELEV00ML1', 'CHALL005L1', 'WELEV00ML1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL006L1_CHALL007L1', 'CHALL006L1', 'CHALL007L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL007L1_CHALL008L1', 'CHALL007L1', 'CHALL008L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL008L1_CDEPT004L1', 'CHALL008L1', 'CDEPT004L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL008L1_WELEV00KL1', 'CHALL008L1', 'WELEV00KL1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL009L1_CHALL010L1', 'CHALL009L1', 'CHALL010L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL009L1_CRETL001L1', 'CHALL009L1', 'CRETL001L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL010L1_CREST003L1', 'CHALL010L1', 'CREST003L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL011L1_WELEV00JL1', 'CHALL011L1', 'WELEV00JL1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL012L1_CHALL013L1', 'CHALL012L1', 'CHALL013L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL013L1_CDEPT002L1', 'CHALL013L1', 'CDEPT002L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL014L1_WELEV00LL1', 'CHALL014L1', 'WELEV00LL1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL015L1_CCONF001L1', 'CHALL015L1', 'CCONF001L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CHALL015L1_CHALL011L1', 'CHALL015L1', 'CHALL011L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CLABS001L1_CREST002L1', 'CLABS001L1', 'CREST002L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CLABS002L1_CHALL005L1', 'CLABS002L1', 'CHALL005L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CLABS002L1_CREST001L1', 'CLABS002L1', 'CREST001L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CLABS003L1_CHALL006L1', 'CLABS003L1', 'CHALL006L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CLABS004L1_CLABS003L1', 'CLABS004L1', 'CLABS003L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CLABS005L1_CHALL003L1', 'CLABS005L1', 'CHALL003L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CREST002L1_CHALL006L1', 'CREST002L1', 'CHALL006L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CREST003L1_CHALL015L1', 'CREST003L1', 'CHALL015L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CREST004L1_CLABS005L1', 'CREST004L1', 'CLABS005L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CRETL001L1_CHALL012L1', 'CRETL001L1', 'CHALL012L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('CSERV001L1_CCONF002L1', 'CSERV001L1', 'CCONF002L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('WELEV00HL1_CHALL004L1', 'WELEV00HL1', 'CHALL004L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('WELEV00KL1_CHALL009L1', 'WELEV00KL1', 'CHALL009L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('WELEV00LL1_CHALL001L1', 'WELEV00LL1', 'CHALL001L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('WELEV00ML1_CLABS001L1', 'WELEV00ML1', 'CLABS001L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('GEXIT001L1_GHALL002L1', 'GEXIT001L1', 'GHALL002L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('GHALL002L1_GHALL003L1', 'GHALL002L1', 'GHALL003L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('GHALL003L1_GHALL004L1', 'GHALL003L1', 'GHALL004L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('GHALL003L1_GHALL005L1', 'GHALL003L1', 'GHALL005L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('GHALL005L1_GSTAI008L1', 'GHALL005L1', 'GSTAI008L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('GHALL005L1_GHALL006L1', 'GHALL005L1', 'GHALL006L1');
INSERT INTO dev."Edge" ("edgeID", "startNode", "endNode") VALUES ('GHALL006L1_GELEV007L1', 'GHALL006L1', 'GELEV00QL1');





--
-- Data for Name: Node; Type: TABLE DATA; Schema: dev; Owner: dev
--

INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CCONF001L1', 2255, 849, 'L1', '45 Francis', 'CONF', 'Anesthesia Conf Floor L1', 'Conf C001L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CCONF002L1', 2665, 1043, 'L1', '45 Francis', 'CONF', 'Medical Records Conference Room Floor L1', 'Conf C002L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CCONF003L1', 2445, 1245, 'L1', '45 Francis', 'CONF', 'Abrams Conference Room', 'Conf C003L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CDEPT002L1', 1980, 844, 'L1', 'Tower', 'DEPT', 'Day Surgery Family Waiting Floor L1', 'Department C002L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CDEPT003L1', 1845, 844, 'L1', 'Tower', 'DEPT', 'Day Surgery Family Waiting Exit Floor L1', 'Department C003L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CDEPT004L1', 2310, 1043, 'L1', '45 Francis', 'DEPT', 'Medical Records Film Library Floor L1', 'Department C004L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL001L1', 1732, 924, 'L1', 'Tower', 'HALL', 'Hallway 1 Floor L1', 'Hallway C001L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL002L1', 2445, 1043, 'L1', '45 Francis', 'HALL', 'Hallway 2 Floor L1', 'Hallway C002L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL003L1', 2445, 1284, 'L1', '45 Francis', 'HALL', 'Hallway 3 Floor L1', 'Hallway C003L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL004L1', 2770, 1070, 'L1', '45 Francis', 'HALL', 'Hallway 4 Floor L1', 'Hallway C004L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL005L1', 1750, 1284, 'L1', 'Tower', 'HALL', 'Hallway 5 Floor L1', 'Hallway C005L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL006L1', 2130, 1284, 'L1', 'Tower', 'HALL', 'Hallway 6 Floor L1', 'Hallway C006L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL007L1', 2130, 1045, 'L1', 'Tower', 'HALL', 'Hallway 7 Floor L1', 'Hallway C007L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL008L1', 2215, 1045, 'L1', '45 Francis', 'HALL', 'Hallway 8 Floor L1', 'Hallway C008L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL009L1', 2220, 904, 'L1', '45 Francis', 'HALL', 'Hallway 9 Floor L1', 'Hallway C009L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL010L1', 2265, 904, 'L1', '45 Francis', 'HALL', 'Hallway 10 Floor L1', 'Hallway C010L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL011L1', 2360, 849, 'L1', '45 Francis', 'HALL', 'Hallway 11 Floor L1', 'Hallway C011L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL012L1', 2130, 904, 'L1', '45 Francis', 'HALL', 'Hallway 12 Floor L1', 'Hallway C012L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL013L1', 2130, 844, 'L1', '45 Francis', 'HALL', 'Hallway 13 Floor L1', 'Hallway C013L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL014L1', 1845, 924, 'L1', 'Tower', 'HALL', 'Hallway 14 Floor L1', 'Hallway C014L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CHALL015L1', 2300, 849, 'L1', '45 Francis', 'HALL', 'Hallway 15 Floor L1', 'Hallway C015L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CLABS001L1', 1965, 1284, 'L1', 'Tower', 'LABS', 'Outpatient Fluoroscopy Floor L1', 'Lab C001L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CLABS002L1', 1750, 1090, 'L1', 'Tower', 'LABS', 'Pre-Op PACU Floor L1', 'Lab C002L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CLABS003L1', 2290, 1284, 'L1', '45 Francis', 'LABS', 'Nuclear Medicine Floor L1', 'Lab C003L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CLABS004L1', 2320, 1284, 'L1', '45 Francis', 'LABS', 'Ultrasound Floor L1', 'Lab C004L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CLABS005L1', 2770, 1284, 'L1', '45 Francis', 'LABS', 'CSIR MRI Floor L1', 'Lab C005L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CREST001L1', 1732, 1019, 'L1', 'Tower', 'REST', 'Restroom L Elevator Floor L1', 'Restroom C001L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CREST002L1', 2065, 1284, 'L1', 'Tower', 'REST', 'Restroom M Elevator Floor L1', 'Restroom C002L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CREST003L1', 2300, 879, 'L1', '45 Francis', 'REST', 'Restroom K Elevator Floor L1', 'Restroom C003L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CREST004L1', 2770, 1160, 'L1', '45 Francis', 'REST', 'Restroom H Elevator Floor L1', 'Restroom C004L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CRETL001L1', 2185, 904, 'L1', '45 Francis', 'RETL', 'Vending Machine 1 L1', 'Retail C001L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CSERV001L1', 2490, 1043, 'L1', '45 Francis', 'SERV', 'Volunteers Floor L1', 'Service C001L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('CSERV001L2', 2015, 1280, 'L2', '45 Francis', 'SERV', 'Interpreter Services Floor L2', 'Service C001L2');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('GELEV00QL1', 1637, 2116, 'L1', 'Shapiro', 'ELEV', 'Elevator Q MapNode 7 Floor L1', 'Elevator Q L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('GEXIT001L1', 1702, 2260, 'L1', 'Shapiro', 'EXIT', 'Fenwood Road Exit MapNode 1 Floor L1', 'Fenwood Road EntranceExit L1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('GHALL002L1', 1702, 2167, 'L1', 'Shapiro', 'HALL', 'Hallway MapNode 2 Floor L1', 'Hall');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('GHALL003L1', 1688, 2167, 'L1', 'Shapiro', 'HALL', 'Hallway MapNode 3 Floor L1', 'Hall');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('GHALL004L1', 1666, 2167, 'L1', 'Shapiro', 'HALL', 'Hallway MapNode 4 Floor L1', 'Hall');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('GHALL005L1', 1688, 2131, 'L1', 'Shapiro', 'HALL', 'Hallway MapNode 5 Floor L1', 'Hall');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('GHALL006L1', 1665, 2116, 'L1', 'Shapiro', 'HALL', 'Hallway MapNode 6 Floor L1', 'Hall');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('GSTAI008L1', 1720, 2131, 'L1', 'Shapiro', 'STAI', 'Stairs MapNode 8 Floor L1', 'L1 Stairs');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('WELEV00HL1', 2715, 1070, 'L1', '45 Francis', 'ELEV', 'Elevator H Floor L1', 'Elevator HL1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('WELEV00JL1', 2360, 799, 'L1', '45 Francis', 'ELEV', 'Elevator J Floor L1', 'Elevator JL1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('WELEV00KL1', 2220, 974, 'L1', '45 Francis', 'ELEV', 'Elevator K Floor L1', 'Elevator KL1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('WELEV00LL1', 1785, 924, 'L1', 'Tower', 'ELEV', 'Elevator L Floor L1', 'Elevator LL1');
INSERT INTO dev."Node" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") VALUES ('WELEV00ML1', 1820, 1284, 'L1', 'Tower', 'ELEV', 'Elevator M Floor L1', 'Elevator ML1');






--
-- Name: Node Node_pkey; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."Node"
    ADD CONSTRAINT "Node_pkey" PRIMARY KEY ("nodeID");

--
-- Name: Edge Edge_pkey; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."Edge"
    ADD CONSTRAINT "Edge_pkey" PRIMARY KEY ("edgeID");

--
-- Name: Edge Edge_fk1; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."Edge"
    ADD CONSTRAINT "Edge_fk1" Foreign KEY ("startNode") references dev."Node" ("nodeID") ON DELETE CASCADE;

--
-- Name: Edge Edge_fk2; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."Edge"
    ADD CONSTRAINT "Edge_fk2" FOREIGN KEY ("endNode") references dev."Node" ("nodeID") ON DELETE CASCADE;


--
-- Name: Employee; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."Employee"(
    "employeeID" text NOT NULL, --Primary Key
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "email" text NOT NULL,
    "job" text NOT NULL,
    "accessLevel" text NOT NULL
);

--ALTER TABLE dev."Employee" OWNER to dev;

--
-- Name: Employee; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."ServiceRequest"(
    "requestID" text NOT NULL, --Primary Key
    "requestType" text NOT NULL,
    "priority" text NOT NULL,
    "location" text NOT NULL,
    "status" text NOT NULL,
    "requester" text, --Foreign Key -> Employee
    "helpingEmployee" text, --Foreign Key -> Employee
    "desc" text NOT NULL,
    "time" timestamp
);

--ALTER TABLE dev."ServiceRequest" OWNER to dev;

ALTER TABLE dev."ServiceRequest"
    ALTER COLUMN "time" TYPE timestamp with time zone;

ALTER TABLE dev."ServiceRequest"
    ALTER COLUMN "time" SET default current_timestamp;

--
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeID");

--
--  Name: ServiceRequest ServiceRequest_pkey; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("requestID");

--
-- Name: ServiceRequest ServiceRequest_fk1; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_fk1" FOREIGN KEY ("location") REFERENCES dev."Node" ("nodeID") ON DELETE CASCADE;

--
-- Name: ServiceRequest ServiceRequest_fk2; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_fk2" FOREIGN KEY ("helpingEmployee") REFERENCES dev."Employee" ("employeeID") ON DELETE SET NULL;

--
-- Name: ServiceRequest ServiceRequest_fk3; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_fk3" FOREIGN KEY ("requester") REFERENCES dev."Employee"("employeeID") ON DELETE SET NULL;


--
-- Data for Name: Employee; Type: TABLE DATA; Schema: dev; Owner: dev
--

INSERT INTO dev."Employee" ("employeeID", "firstName", "lastName", "email", "job", "accessLevel") VALUES ('auth0|65c415e271e231c3b5f45af0', 'admin', 'admin', 'softengc24G@gmail.com', 'admin', 'admin');
INSERT INTO dev."Employee" ("employeeID", "firstName", "lastName", "email", "job", "accessLevel") VALUES ('testStaff', 'staff', 'staff', 'staff', 'staff', 'staff');
INSERT INTO dev."Employee" ("employeeID", "firstName", "lastName", "email", "job", "accessLevel") VALUES ('auth0|65c429b2125832ae8f4c0077', 'Flow', 'Erman', 'fekeg78344@laymro.com', 'flowerdeliveryman', 'staff');
INSERT INTO dev."Employee" ("employeeID", "firstName", "lastName", "email", "job", "accessLevel") VALUES ('auth0|65c430e6717b4796d888c313', 'Daisy', 'Deliverer', 'jebenow403@fkcod.com', 'flowerdeliveryman', 'staff');


--
-- Data for Name: ServiceRequest; Type: TABLE DATA; Schema: dev; Owner: dev
--

INSERT INTO dev."ServiceRequest" ("requestID", "requestType", "priority", "location", "status", "requester", "helpingEmployee", "desc") VALUES ('flowers1', 'Flowers', 'Low', 'CCONF001L1', 'Assigned', 'auth0|65c415e271e231c3b5f45af0', 'testStaff', 'flowers to be sent to room');
INSERT INTO dev."ServiceRequest" ("requestID", "requestType", "priority", "location", "status", "requester", "helpingEmployee", "desc") VALUES ('flowers2', 'Flowers', 'High', 'CCONF001L1', 'Assigned', 'testStaff', 'testStaff', 'flowers to be sent to room');


--
-- Name: Announcement; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."Announcement"(
    "announcementID" text NOT NULL, --primary key
    "desc" text NOT NULL,
    "requester" text NOT NULL, --references employee
    "emergency" bool NOT NULL,
    "time" timestamp
);

--ALTER TABLE dev."Announcement" OWNER to dev;

ALTER TABLE dev."Announcement"
    ALTER COLUMN "time" TYPE timestamp with time zone;

ALTER TABLE dev."Announcement"
    ALTER COLUMN "time" SET default current_timestamp;


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: dev; owner: dev
--

ALTER TABLE ONLY dev."Announcement"
    ADD CONSTRAINT "Announcenments_pkey" PRIMARY KEY ("announcementID");

--
-- Name: Announcement Announcement_fk1; Type: CONSTRAINT; Schema: dev; owner: dev
--

ALTER TABLE ONLY dev."Announcement"
    ADD CONSTRAINT "Announcement_fk1" FOREIGN KEY ("requester") REFERENCES dev."Employee" ("employeeID");


--
-- Data for Name: ServiceRequest; Type: TABLE DATA; Schema: dev; Owner: dev
--

INSERT INTO dev."Announcement" ("announcementID", "desc", "requester", "emergency") VALUES ('announcement1', 'Lot C is under Construction', 'testStaff', 'false');
INSERT INTO dev."Announcement" ("announcementID", "desc", "requester", "emergency") VALUES ('announcement2', 'THERE IS A FIRE!', 'auth0|65c415e271e231c3b5f45af0', 'true');


--
-- Name: ServiceRequestFlowers; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."ServiceRequestFlowers" (
    "requestID" text NOT NULL, --Primary and Foreign Key
    "flowerType" text NOT NULL,
    "amount" integer NOT NULL
);

--ALTER TABLE ONLY dev."ServiceRequestFlowers" OWNER to dev;

--
-- Name: ServiceRequestFlowers ServiceRequestFlowers_pkey; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestFlowers"
    ADD CONSTRAINT "ServiceRequestFlowers_pkey" PRIMARY KEY ("requestID");

--
-- Name: ServiceRequestFlowers ServiceRequestFlowers_fk1; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestFlowers"
    ADD CONSTRAINT "ServiceRequestFlowers_fk1" FOREIGN KEY ("requestID") REFERENCES dev."ServiceRequest" ("requestID") ON DELETE CASCADE;


--
-- Name: ServiceRequestReligious; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."ServiceRequestReligious"(
    "requestID" text NOT NULL, --Primary and Foreign Key
    "faith" text NOT NULL
);

--ALTER TABLE ONLY dev."ServiceRequestReligious" OWNER to dev;

--
-- Name: ServiceRequestReligious ServiceRequestReligious_pkey; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestReligious"
    ADD CONSTRAINT "ServiceRequestReligious_pkey" PRIMARY KEY ("requestID");

--
-- Name: ServiceRequestReligious ServiceRequestReligious_fk1; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestReligious"
    ADD CONSTRAINT "ServiceRequestReligious_fk1" FOREIGN KEY ("requestID") REFERENCES dev."ServiceRequest" ("requestID") ON DELETE CASCADE;


--
-- Name: ServiceRequestSanitation; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."ServiceRequestSanitation"(
    "requestID" text NOT NULL, --Primary and Foreign Key
    "hazardous" boolean NOT NULL,
    "messType" text NOT NULL
);

--ALTER TABLE ONLY dev."ServiceRequestSanitation" OWNER to dev;

--
-- Name: ServiceRequestSanitation ServiceRequestSanitation_pkey; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestSanitation"
    ADD CONSTRAINT "ServiceRequestSanitation_pkey" PRIMARY KEY ("requestID");

--
-- Name: ServiceRequestSanitation ServiceRequestSanitation_fk1; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestSanitation"
    ADD CONSTRAINT "ServiceRequestSanitation_fk1" FOREIGN KEY ("requestID") REFERENCES dev."ServiceRequest" ("requestID") ON DELETE CASCADE;

--
-- Name: ServiceRequestInterpreter; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."ServiceRequestInterpreter"(
    "requestID" text NOT NULL, --Primary and Foreign Key
    "language" text NOT NULL
);

--ALTER TABLE ONLY dev."ServiceRequestInterpreter" OWNER to dev;

--
-- Name: ServiceRequestInterpreter ServiceRequestInterpreter_pkey Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestInterpreter"
    ADD CONSTRAINT "ServiceRequestInterpreter_pkey" PRIMARY KEY ("requestID");

--
-- Name: ServiceRequestInterpreter ServiceRequestInterpreter_fk1 Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestInterpreter"
    ADD CONSTRAINT "ServiceRequestInterpreter" FOREIGN KEY ("requestID") REFERENCES dev."ServiceRequest" ("requestID") ON DELETE CASCADE;


--
-- Name: ServiceRequestExternalTransport; Type: TABLE; Schema: dev; Owner: dev
--

CREATE TABLE dev."ServiceRequestExternalTransport"(
    "requestID" text NOT NULL, --Primary and Foreign Key
    "vehicle" text NOT NULL,
    "destination" text NOT NULL
);

--ALTER TABLE ONLY dev."ServiceRequestExternalTransport" OWNER to dev;

--
-- Name: ServiceRequestExternalTransport ServiceRequestExternalTransport_pkey; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestExternalTransport"
    ADD CONSTRAINT "ServiceRequestExternalTransport_pkey" PRIMARY KEY ("requestID");

--
-- Name: ServiceRequestExternalTransport ServiceReqeustExternalTransport_fk1; Type: CONSTRAINT; Schema: dev; Owner: dev
--

ALTER TABLE ONLY dev."ServiceRequestExternalTransport"
    ADD CONSTRAINT "ServiceRequestExternalTransport_fk1" FOREIGN KEY ("requestID") REFERENCES dev."ServiceRequest" ("requestID") ON DELETE CASCADE;
