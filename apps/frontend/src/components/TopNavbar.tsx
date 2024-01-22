import React from "react";
import "./styles/TopNavbar.css";
import { Nav, Navbar, Container } from "react-bootstrap";

export const TopNavbar = () => {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/search">Search</Nav.Link>
          <Nav.Link href="/login">Map</Nav.Link>
          <Nav.Link href="/map">Login</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
