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
-- Name: Announcements; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."Announcements"(
    "announcementID" text NOT NULL, --primary key
    "desc" text NOT NULL,
    "requester" text NOT NULL, --references employee
    "emergency" bool NOT NULL,
    "time" timestamp
);

ALTER TABLE public."Announcements" OWNER to dev;

ALTER TABLE public."Announcements"
    ALTER COLUMN "time" TYPE timestamp with time zone;

ALTER TABLE public."Announcements"
    ALTER COLUMN "time" SET default current_timestamp;


--
-- Name: Announcements Announcements_pkey; Type: CONSTRAINT; Schema: public; owner: dev
--

ALTER TABLE ONLY public."Announcements"
    ADD CONSTRAINT "Announcenments_pkey" PRIMARY KEY ("announcementID");

--
-- Name: Announcements Announcements_fk1; Type: CONSTRAINT; Schema: public; owner: dev
--

ALTER TABLE ONLY public."Announcements"
    ADD CONSTRAINT "Announcements_fk1" FOREIGN KEY ("requester") REFERENCES public."Employee" ("employeeID");
