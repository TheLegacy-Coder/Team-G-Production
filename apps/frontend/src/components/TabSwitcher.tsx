import React, { ReactNode, useState } from "react";
import "./styles/TabSwitcher.css";
export interface TabSwitcherProps {
  titles: string[];
  components: ReactNode[];
}

export const TabSwitcher = (props: TabSwitcherProps) => {
  const [selected, setSelected] = useState(props.titles[0]);
  let selectedIndex = 0;
  props.titles.forEach((title, i) => {
    if (title === selected) {
      selectedIndex = i;
    }
  });

  return (
    <>
      <div className={"tab-switcher-container"}>
        {props.titles.map(function (title) {
          return (
            <div
              className={
                "tab-switcher-tab" + (title === selected ? "-selected" : "")
              }
              id={title}
              onClick={() => {
                setSelected(title);
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
