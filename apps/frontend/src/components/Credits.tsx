import React, { useEffect, useRef, useState } from "react";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { About } from "./About.tsx";
import "./styles/Credits.css";

export const Credits = () => {
  const container = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);

  const [scrollHeight, setScrollHeight] = useState<string>("");

  useEffect(() => {
    setScrollHeight(
      container.current
        ? container.current.clientHeight.toString()
        : "0" + "px",
    );
  }, []);

  return (
    <div className={"encompassing-div"} ref={container}>
      <div
        className={"credits-container"}
        ref={scroll}
        style={{ height: scrollHeight }}
      >
        <div className={"credits-box"}>
          <div className={"credits-text"}>React 18.3.0</div>
          <a
            href={"https://react.dev/"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <div className={"credits-box"}>
          <div className={"credits-text"}>React Router 6.21.3</div>
          <a
            href={"https://reactrouter.com/en/main"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <div className={"credits-box"}>
          <div className={"credits-text"}>React Bootstrap 2.10.0</div>
          <a
            href={"https://react-bootstrap.netlify.app/"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <div className={"credits-box"}>
          <div className={"credits-text"}>Axios 1.4.0</div>
          <a
            href={"https://www.npmjs.com/package/axios"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <div className={"credits-box"}>
          <div className={"credits-text"}>Reaviz 15.8.0</div>
          <a
            href={"https://reaviz.io/?path=/docs/docs-intro--docs"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <div className={"credits-box"}>
          <div className={"credits-text"}>Webstorm 2023.3.2</div>
          <a
            href={"https://www.jetbrains.com/webstorm/"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <div className={"credits-box"}>
          <div className={"credits-text"}>Docker 4.26.1</div>
          <a
            href={"https://www.docker.com/products/docker-desktop/"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <div className={"credits-box"}>
          <div className={"credits-text"}>Prisma 5.9.0</div>
          <a
            href={"https://www.prisma.io/"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <div className={"credits-box"}>
          <div className={"credits-text"}>PostGreSQL 16.1</div>
          <a
            href={"https://www.postgresql.org/"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <div className={"credits-box"}>
          <div className={"credits-text"}>Express.js 4.18.2</div>
          <a
            href={"https://expressjs.com/"}
            className={"credits-link"}
            target={"_blank"}
          >
            Link to website
          </a>
        </div>
        <ContextMenuRouterButton
          content={<About />}
          lable={"About"}
          protected={false}
          style={"back-button"}
          button={true}
          customText={"Back"}
        />
      </div>
    </div>
  );
};
