import React from "react";
import "./styles/TopNavbar.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import { CloseProgram } from "../components/CloseProgram.tsx";
import { Link } from "react-router-dom";

export const TopNavbar = () => {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Nav className="me-auto">
          <Link to="/" style={{ textDecoration: "none" }}>
            Home
          </Link>

          <div>&nbsp;&nbsp;&nbsp;</div>
          <Link to="/map" style={{ textDecoration: "none" }}>
            Map
          </Link>
          <div>&nbsp;&nbsp;&nbsp;</div>
          <Link to="/search" style={{ textDecoration: "none" }}>
            Search
          </Link>
          <div>&nbsp;&nbsp;&nbsp;</div>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            Profile
          </Link>
          <div>&nbsp;&nbsp;&nbsp;</div>
          <Link to="/login" style={{ textDecoration: "none" }}>
            Login
          </Link>
        </Nav>
        <CloseProgram /> {/* Add the CloseButton component */}
      </Container>
    </Navbar>
  );
};
