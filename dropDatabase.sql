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
-- Drop: Announcement
--

DROP TABLE dev."Announcement";

--
-- Drop: ServiceRequestFlowers
--

DROP TABLE dev."ServiceRequestFlowers";

--
-- Drop: ServiceRequestReligious
--

DROP TABLE dev."ServiceRequestReligious";

--
-- Drop: ServiceRequestSanitation
--

DROP TABLE dev."ServiceRequestSanitation";

--
-- Drop: ServiceRequestInterpreter
--

DROP TABLE dev."ServiceRequestInterpreter";

--
-- Drop: ServiceRequestExternalTransport
--

DROP TABLE dev."ServiceRequestExternalTransport";

--
-- Drop: ServiceRequest
--

DROP TABLE dev."ServiceRequest";

--
-- Drop: Employee
--

DROP TABLE dev."Employee";

--
-- Drop: Edge
--

DROP TABLE dev."Edge";

--
-- Drop: Node
--

DROP TABLE dev."Node";
