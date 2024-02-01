import React, { FormEvent, useReducer } from "react";
import { ContextMenuRouterButton } from "./ContextMenuRouterButton.tsx";
import { nodeStore } from "../map/MapNode.ts";

export const Flowers = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  nodeStore.currentRefresh = forceUpdate;
  function getValue(event: FormEvent<HTMLFormElement>, name: string) {
    const elm = event.currentTarget.elements.namedItem(
      name,
    ) as HTMLInputElement;
    return elm.value;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("Textarea Value:", getValue(event, "desc"));
    console.log(nodeStore.selectedNode);
  };

  // const handleTextareaChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
  //     setTextareaValue(event.target.value);
  // };
  console.log("NOE");
  console.log(nodeStore.selectedNode?.longName);
  return (
    <ContextMenuRouterButton
      content={
        <div className={"service-button-text"}>
          <br />
          <div>Service Request Description:</div>

          <form
            id="confirmationForm"
            name="confirmationForm"
            method="post"
            onSubmit={handleSubmit}
          >
            {/*<textarea*/}
            {/*    id="confirmationText"*/}
            {/*    className="text"*/}
            {/*    style={{width: 250, height: 350}}*/}
            {/*    name="confirmationText"*/}
            {/*    form="confirmationForm"*/}
            {/*    onChange={handleTextareaChange}*/}
            {/*></textarea>*/}
            <input type="text" className="desc" name={"desc"} />
            <input
              type="text"
              value={
                nodeStore.selectedNode === undefined
                  ? "Select node"
                  : nodeStore.selectedNode.longName
              }
              className="submitButton"
            />
            <input type="submit" value="Submit" className="submitButton" />
          </form>
        </div>
      }
      lable={"Flowers"} // Fixed typo in the label attribute
      style={"request-nav-style"}
    />
  );
};
