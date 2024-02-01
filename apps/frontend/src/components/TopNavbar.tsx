import React from "react";
import "./styles/TopNavbar.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import { CloseProgram } from "../components/CloseProgram.tsx";
import { Link } from "react-router-dom";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { Login } from "../routes/Login.tsx";
import { ServiceRequests } from "./ServiceRequests.tsx";

export const TopNavbar = () => {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Nav className="me-auto">
          <Link to="/" style={{ textDecoration: "none" }}>
            Home
          </Link>

          <div>&nbsp;&nbsp;&nbsp;</div>

          <div>&nbsp;&nbsp;&nbsp;</div>

          <ContextMenuRouterButton
            content={<div>search placeholder</div>}
            lable={"Search"}
            protected={true}
            style={"nav-button"}
          />

          <div>&nbsp;&nbsp;&nbsp;</div>

          <ContextMenuRouterButton
            content={<div>placeholder</div>}
            lable={"Help"}
            protected={false}
            style={"nav-button"}
          />
          <div>&nbsp;&nbsp;&nbsp;</div>

          <ContextMenuRouterButton
            content={<ServiceRequests />}
            lable={"Service Request"}
            protected={true}
            style={"nav-button"}
          />
          <div>&nbsp;&nbsp;&nbsp;</div>

          <ContextMenuRouterButton
            content={<Login />}
            lable={"Login"}
            style={"nav-button"}
          />
        </Nav>
        <CloseProgram /> {/* Add the CloseButton component */}
      </Container>
    </Navbar>
  );
};
