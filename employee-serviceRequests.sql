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
-- Name: Employee; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Employee"(
    "employeeID" text NOT NULL, --Primary Key
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "username" text NOT NULL,
    "password" text NOT NULL,
    "job" text NOT NULL,
    "accessLevel" text NOT NULL
);

ALTER TABLE public."Employee" OWNER to dev;

INSERT INTO public."Employee" VALUES ('admin', 'admin', 'admin', 'admin', 'admin', 'admin', 'admin');

--
-- Name: Employee; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."ServiceRequest"(
    "requestID" text NOT NULL, --Primary Key
    "requestType" text NOT NULL,
    "location" text NOT NULL,
    "status" text NOT NULL,
    "requester" text NOT NULL,
    "helpingEmployee" text,
    "desc" text NOT NULL,
    "time" timestamp
);

ALTER TABLE public."ServiceRequest" OWNER to dev;

ALTER TABLE public."ServiceRequest"
    ALTER COLUMN "time" TYPE timestamp with time zone;

ALTER TABLE public."ServiceRequest"
    ALTER COLUMN "time" SET default current_timestamp;

--
-- Name: Employee Employee_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeID");

--
--  Name: ServiceRequest ServiceRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("requestID");

--
-- Name: ServiceRequest ServiceRequest_fk1; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_fk1" FOREIGN KEY ("location") REFERENCES public."Node" ("nodeID") ON DELETE CASCADE;

--
-- Name: ServiceRequest ServiceRequest_fk2; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_fk2" FOREIGN KEY ("helpingEmployee") REFERENCES public."Employee" ("employeeID");

--
-- Name: ServiceRequest ServiceRequest_fk3; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."ServiceRequest"
    ADD CONSTRAINT "ServiceRequest_fk3" FOREIGN KEY ("requester") REFERENCES public."Employee"("employeeID");




--
-- PostgreSQL database dump complete
--
