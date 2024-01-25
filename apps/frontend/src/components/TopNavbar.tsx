import React from "react";
import "./styles/TopNavbar.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import CloseProgram from "../components/CloseProgram.tsx";
import { Link } from "react-router-dom";

export const TopNavbar = () => {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Nav className="me-auto">
          <Link to="/">Home</Link>
          <div>&nbsp;&nbsp;&nbsp;</div>
          <Link to="/map">Map</Link>
          <div>&nbsp;&nbsp;&nbsp;</div>
          <Link to="/search">Search</Link>
          <div>&nbsp;&nbsp;&nbsp;</div>
          <Link to="/profile">Profile</Link>
          <div>&nbsp;&nbsp;&nbsp;</div>
          <Link to="/login">Login</Link>
        </Nav>
        <CloseProgram /> {/* Add the CloseButton component */}
      </Container>
    </Navbar>
  );
};
