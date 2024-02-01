import React, { useReducer } from "react";
import "./styles/TopNavbar.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import { CloseProgram } from "./CloseProgram.tsx";
import { Link } from "react-router-dom";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { Login } from "../routes/Login.tsx";
import { loginStore } from "../stores/LoginStore.ts";
import { ServiceRequests } from "./ServiceRequests.tsx";

export const TopNavbar = () => {
  const AdminButtons = () => {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    loginStore.navbarRefreshHook = forceUpdate;
    console.log(loginStore.loginType, loginStore.loggedIn);
    if (loginStore.loginType === "admin" && loginStore.loggedIn) {
      return (
        <div>
          <Link to="/csvs" style={{ textDecoration: "none" }}>
            CSVs
          </Link>
          <div>&nbsp;&nbsp;&nbsp;</div>
        </div>
      );
    }
    return <></>;
  };
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

          <div>&nbsp;&nbsp;&nbsp;</div>
          <Link to="/profile" style={{ textDecoration: "none" }}>
            Profile
          </Link>
          <div>&nbsp;&nbsp;&nbsp;</div>

          <ContextMenuRouterButton
            content={<div>placeholder</div>}
            lable={"Help"}
            protected={true}
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

          <div>&nbsp;&nbsp;&nbsp;</div>

          <AdminButtons />
        </Nav>
        <CloseProgram /> {/* Add the CloseButton component */}
      </Container>
    </Navbar>
  );
};
