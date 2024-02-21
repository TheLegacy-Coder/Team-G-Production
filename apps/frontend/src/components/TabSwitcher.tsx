import React, { ReactNode, useState } from "react";
import "./styles/TabSwitcher.css";
export interface TabSwitcherProps {
  titles: string[];
  components: ReactNode[];
}

export const TabSwitcher = (props: TabSwitcherProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <div className={"tab-switcher-container"}>
        {props.titles.map(function (title, index) {
          return (
            <div
              className={
                "tab-switcher-tab" +
                (title === props.titles[selectedIndex] ? "-selected" : "")
              }
              id={title}
              onClick={() => {
                setSelectedIndex(index);
              }}
            >
              {title}
            </div>
          );
        })}
      </div>
      <div className={"tab-content"}>{props.components[selectedIndex]}</div>
    </>
  );
};
