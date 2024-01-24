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
-- Name: Edges; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Edges" (
    "edgeID" text NOT NULL,
    "startNode" text NOT NULL,
    "endNode" text NOT NULL
);


ALTER TABLE public."Edges" OWNER TO dev;

--
-- Name: HighScore; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."HighScore" (
    id integer NOT NULL,
    "time" timestamp(3) without time zone NOT NULL,
    score integer NOT NULL
);


ALTER TABLE public."HighScore" OWNER TO dev;

--
-- Name: HighScore_id_seq; Type: SEQUENCE; Schema: public; Owner: dev
--

CREATE SEQUENCE public."HighScore_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."HighScore_id_seq" OWNER TO dev;

--
-- Name: HighScore_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dev
--

ALTER SEQUENCE public."HighScore_id_seq" OWNED BY public."HighScore".id;


--
-- Name: Nodes; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Nodes" (
    "nodeID" text NOT NULL,
    xcoord integer NOT NULL,
    ycoord integer NOT NULL,
    floor text NOT NULL,
    building text NOT NULL,
    "nodeType" text NOT NULL,
    "longName" text NOT NULL,
    "shortName" text NOT NULL
);


ALTER TABLE public."Nodes" OWNER TO dev;

--
-- Name: HighScore id; Type: DEFAULT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."HighScore" ALTER COLUMN id SET DEFAULT nextval('public."HighScore_id_seq"'::regclass);


--
-- Data for Name: Edges; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Edges" ("edgeID", "startNode", "endNode") FROM stdin;
CCONF002L1_WELEV00HL1	CCONF002L1	WELEV00HL1
CCONF003L1_CHALL002L1	CCONF003L1	CHALL002L1
CDEPT002L1_CDEPT003L1	CDEPT002L1	CDEPT003L1
CDEPT003L1_CHALL014L1	CDEPT003L1	CHALL014L1
CDEPT004L1_CHALL002L1	CDEPT004L1	CHALL002L1
CHALL001L1_CREST001L1	CHALL001L1	CREST001L1
CHALL002L1_CSERV001L1	CHALL002L1	CSERV001L1
CHALL003L1_CCONF003L1	CHALL003L1	CCONF003L1
CHALL003L1_CLABS004L1	CHALL003L1	CLABS004L1
CHALL004L1_CREST004L1	CHALL004L1	CREST004L1
CHALL005L1_WELEV00ML1	CHALL005L1	WELEV00ML1
CHALL006L1_CHALL007L1	CHALL006L1	CHALL007L1
CHALL007L1_CHALL008L1	CHALL007L1	CHALL008L1
CHALL008L1_CDEPT004L1	CHALL008L1	CDEPT004L1
CHALL008L1_WELEV00KL1	CHALL008L1	WELEV00KL1
CHALL009L1_CHALL010L1	CHALL009L1	CHALL010L1
CHALL009L1_CRETL001L1	CHALL009L1	CRETL001L1
CHALL010L1_CREST003L1	CHALL010L1	CREST003L1
CHALL011L1_WELEV00JL1	CHALL011L1	WELEV00JL1
CHALL012L1_CHALL013L1	CHALL012L1	CHALL013L1
CHALL013L1_CDEPT002L1	CHALL013L1	CDEPT002L1
CHALL014L1_WELEV00LL1	CHALL014L1	WELEV00LL1
CHALL015L1_CCONF001L1	CHALL015L1	CCONF001L1
CHALL015L1_CHALL011L1	CHALL015L1	CHALL011L1
CLABS001L1_CREST002L1	CLABS001L1	CREST002L1
CLABS002L1_CHALL005L1	CLABS002L1	CHALL005L1
CLABS002L1_CREST001L1	CLABS002L1	CREST001L1
CLABS003L1_CHALL006L1	CLABS003L1	CHALL006L1
CLABS004L1_CLABS003L1	CLABS004L1	CLABS003L1
CLABS005L1_CHALL003L1	CLABS005L1	CHALL003L1
CREST002L1_CHALL006L1	CREST002L1	CHALL006L1
CREST003L1_CHALL015L1	CREST003L1	CHALL015L1
CREST004L1_CLABS005L1	CREST004L1	CLABS005L1
CRETL001L1_CHALL012L1	CRETL001L1	CHALL012L1
CSERV001L1_CCONF002L1	CSERV001L1	CCONF002L1
WELEV00HL1_CHALL004L1	WELEV00HL1	CHALL004L1
WELEV00KL1_CHALL009L1	WELEV00KL1	CHALL009L1
WELEV00LL1_CHALL001L1	WELEV00LL1	CHALL001L1
WELEV00ML1_CLABS001L1	WELEV00ML1	CLABS001L1
GEXIT001L1_GHALL002L1	GEXIT001L1	GHALL002L1
GHALL002L1_GHALL003L1	GHALL002L1	GHALL003L1
GHALL003L1_GHALL004L1	GHALL003L1	GHALL004L1
GHALL003L1_GHALL005L1	GHALL003L1	GHALL005L1
GHALL005L1_GSTAI008L1	GHALL005L1	GSTAI008L1
GHALL005L1_GHALL006L1	GHALL005L1	GHALL006L1
GHALL006L1_GELEV007L1	GHALL006L1	GELEV00QL1
\.


--
-- Data for Name: HighScore; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."HighScore" (id, "time", score) FROM stdin;
\.


--
-- Data for Name: Nodes; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."Nodes" ("nodeID", xcoord, ycoord, floor, building, "nodeType", "longName", "shortName") FROM stdin;
CCONF001L1	2255	849	L1	45 Francis	CONF	Anesthesia Conf Floor L1	Conf C001L1
CCONF002L1	2665	1043	L1	45 Francis	CONF	Medical Records Conference Room Floor L1	Conf C002L1
CCONF003L1	2445	1245	L1	45 Francis	CONF	Abrams Conference Room	Conf C003L1
CDEPT002L1	1980	844	L1	Tower	DEPT	Day Surgery Family Waiting Floor L1	Department C002L1
CDEPT003L1	1845	844	L1	Tower	DEPT	Day Surgery Family Waiting Exit Floor L1	Department C003L1
CDEPT004L1	2310	1043	L1	45 Francis	DEPT	Medical Records Film Library Floor L1	Department C004L1
CHALL001L1	1732	924	L1	Tower	HALL	Hallway 1 Floor L1	Hallway C001L1
CHALL002L1	2445	1043	L1	45 Francis	HALL	Hallway 2 Floor L1	Hallway C002L1
CHALL003L1	2445	1284	L1	45 Francis	HALL	Hallway 3 Floor L1	Hallway C003L1
CHALL004L1	2770	1070	L1	45 Francis	HALL	Hallway 4 Floor L1	Hallway C004L1
CHALL005L1	1750	1284	L1	Tower	HALL	Hallway 5 Floor L1	Hallway C005L1
CHALL006L1	2130	1284	L1	Tower	HALL	Hallway 6 Floor L1	Hallway C006L1
CHALL007L1	2130	1045	L1	Tower	HALL	Hallway 7 Floor L1	Hallway C007L1
CHALL008L1	2215	1045	L1	45 Francis	HALL	Hallway 8 Floor L1	Hallway C008L1
CHALL009L1	2220	904	L1	45 Francis	HALL	Hallway 9 Floor L1	Hallway C009L1
CHALL010L1	2265	904	L1	45 Francis	HALL	Hallway 10 Floor L1	Hallway C010L1
CHALL011L1	2360	849	L1	45 Francis	HALL	Hallway 11 Floor L1	Hallway C011L1
CHALL012L1	2130	904	L1	45 Francis	HALL	Hallway 12 Floor L1	Hallway C012L1
CHALL013L1	2130	844	L1	45 Francis	HALL	Hallway 13 Floor L1	Hallway C013L1
CHALL014L1	1845	924	L1	Tower	HALL	Hallway 14 Floor L1	Hallway C014L1
CHALL015L1	2300	849	L1	45 Francis	HALL	Hallway 15 Floor L1	Hallway C015L1
CLABS001L1	1965	1284	L1	Tower	LABS	Outpatient Fluoroscopy Floor L1	Lab C001L1
CLABS002L1	1750	1090	L1	Tower	LABS	Pre-Op PACU Floor L1	Lab C002L1
CLABS003L1	2290	1284	L1	45 Francis	LABS	Nuclear Medicine Floor L1	Lab C003L1
CLABS004L1	2320	1284	L1	45 Francis	LABS	Ultrasound Floor L1	Lab C004L1
CLABS005L1	2770	1284	L1	45 Francis	LABS	CSIR MRI Floor L1	Lab C005L1
CREST001L1	1732	1019	L1	Tower	REST	Restroom L Elevator Floor L1	Restroom C001L1
CREST002L1	2065	1284	L1	Tower	REST	Restroom M Elevator Floor L1	Restroom C002L1
CREST003L1	2300	879	L1	45 Francis	REST	Restroom K Elevator Floor L1	Restroom C003L1
CREST004L1	2770	1160	L1	45 Francis	REST	Restroom H Elevator Floor L1	Restroom C004L1
CRETL001L1	2185	904	L1	45 Francis	RETL	Vending Machine 1 L1	Retail C001L1
CSERV001L1	2490	1043	L1	45 Francis	SERV	Volunteers Floor L1	Service C001L1
CSERV001L2	2015	1280	L2	45 Francis	SERV	Interpreter Services Floor L2	Service C001L2
GELEV00QL1	1637	2116	L1	Shapiro	ELEV	Elevator Q MapNode 7 Floor L1	Elevator Q L1
GEXIT001L1	1702	2260	L1	Shapiro	EXIT	Fenwood Road Exit MapNode 1 Floor L1	Fenwood Road EntranceExit L1
GHALL002L1	1702	2167	L1	Shapiro	HALL	Hallway MapNode 2 Floor L1	Hall
GHALL003L1	1688	2167	L1	Shapiro	HALL	Hallway MapNode 3 Floor L1	Hall
GHALL004L1	1666	2167	L1	Shapiro	HALL	Hallway MapNode 4 Floor L1	Hall
GHALL005L1	1688	2131	L1	Shapiro	HALL	Hallway MapNode 5 Floor L1	Hall
GHALL006L1	1665	2116	L1	Shapiro	HALL	Hallway MapNode 6 Floor L1	Hall
GSTAI008L1	1720	2131	L1	Shapiro	STAI	Stairs MapNode 8 Floor L1	L1 Stairs
WELEV00HL1	2715	1070	L1	45 Francis	ELEV	Elevator H Floor L1	Elevator HL1
WELEV00JL1	2360	799	L1	45 Francis	ELEV	Elevator J Floor L1	Elevator JL1
WELEV00KL1	2220	974	L1	45 Francis	ELEV	Elevator K Floor L1	Elevator KL1
WELEV00LL1	1785	924	L1	Tower	ELEV	Elevator L Floor L1	Elevator LL1
WELEV00ML1	1820	1284	L1	Tower	ELEV	Elevator M Floor L1	Elevator ML1
\.


--
-- Name: HighScore_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dev
--

SELECT pg_catalog.setval('public."HighScore_id_seq"', 1, false);


--
-- Name: Edges Edges_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Edges"
    ADD CONSTRAINT "Edges_pkey" PRIMARY KEY ("edgeID");


--
-- Name: HighScore HighScore_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."HighScore"
    ADD CONSTRAINT "HighScore_pkey" PRIMARY KEY (id);


--
-- Name: Nodes Nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Nodes"
    ADD CONSTRAINT "Nodes_pkey" PRIMARY KEY ("nodeID");


--
-- PostgreSQL database dump complete
--

