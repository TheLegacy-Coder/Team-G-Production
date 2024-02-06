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
-- Name: Announcement; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Announcement"(
    "announcementID" text NOT NULL, --primary key
    "desc" text NOT NULL,
    "requester" text NOT NULL, --references employee
    "emergency" bool NOT NULL,
    "time" timestamp
);

ALTER TABLE public."Announcement" OWNER to dev;

ALTER TABLE public."Announcement"
    ALTER COLUMN "time" TYPE timestamp with time zone;

ALTER TABLE public."Announcement"
    ALTER COLUMN "time" SET default current_timestamp;


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; owner: dev
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcenments_pkey" PRIMARY KEY ("announcementID");

--
-- Name: Announcement Announcement_fk1; Type: CONSTRAINT; Schema: public; owner: dev
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_fk1" FOREIGN KEY ("requester") REFERENCES public."Employee" ("employeeID");
