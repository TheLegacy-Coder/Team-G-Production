import React from "react";
import "./styles/TopNavbar.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import CloseProgram from "../components/CloseProgram.tsx";

export const TopNavbar = () => {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <CloseProgram /> {/* Add the CloseButton component */}
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/search">Search</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/map">Map</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
