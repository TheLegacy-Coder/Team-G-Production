import React, { useReducer } from "react";
import "./styles/TopNavbar.css";
import { Nav, Navbar, Container } from "react-bootstrap";
import { CloseProgram } from "./CloseProgram.tsx";
import { Link } from "react-router-dom";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { Login } from "../routes/Login.tsx";
import { loginStore } from "../stores/LoginStore.ts";
import { ServiceRequests } from "./ServiceRequests.tsx";
import { HelpPage } from "./HelpPage.tsx";

export const TopNavbar = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  loginStore.navbarRefreshHook = forceUpdate;

  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container>
        <Nav className="me-auto">
          {/*<Link to="/" style={{ textDecoration: "none" }}>*/}
          {/*  Home*/}
          {/*</Link>*/}

          {/*  <ContextMenuRouterButton*/}
          {/*  content={<div>search placeholder</div>}*/}
          {/*  lable={"Search"}*/}
          {/*  protected={true}*/}
          {/*  style={"nav-button"}*/}
          {/*/>*/}

          <div>&nbsp;&nbsp;&nbsp;</div>

          <ContextMenuRouterButton
            content={<HelpPage />}
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

          <div>&nbsp;&nbsp;&nbsp;</div>

          {(loginStore.loginType === "admin" ||
            loginStore.loginType === "staff") &&
          loginStore.loggedIn ? (
            <>
              {loginStore.loginType === "admin" ? (
                <>
                  <Link to="/csvs" className={"nav-button-admin"}>
                    Nodes
                  </Link>
                  <div>&nbsp;&nbsp;&nbsp;</div>
                </>
              ) : (
                <></>
              )}
              <Link to="/requests" className={"nav-button-admin"}>
                Service Requests
              </Link>
              <div>&nbsp;&nbsp;&nbsp;</div>
              <Link to="/employees" className={"nav-button-admin"}>
                Employees
              </Link>
              <div>&nbsp;&nbsp;&nbsp;</div>
              <Link to="/" className={"nav-button-admin"}>
                Home
              </Link>
            </>
          ) : (
            <></>
          )}
        </Nav>
        <CloseProgram /> {/* Add the CloseButton component */}
      </Container>
    </Navbar>
  );
};
