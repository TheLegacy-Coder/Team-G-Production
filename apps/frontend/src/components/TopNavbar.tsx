import React from "react";
import "./styles/TopNavbar.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import CloseProgram from "../components/CloseProgram.tsx";
import { Link } from "react-router-dom";

export const TopNavbar = () => {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <CloseProgram /> {/* Add the CloseButton component */}
      <Container>
        <Nav className="me-auto">
          <Link to="/">Home</Link>
          <Link to="/map">Map</Link>
          <Link to="/search">Search</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
