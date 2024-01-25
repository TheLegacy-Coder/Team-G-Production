import React from "react";
import Button from "react-bootstrap/Button";

interface ResourceButtonProps {
  value: string;
}

export const ResourceButton = (props: ResourceButtonProps) => {
  const { value } = props;

  return (
    <div style={{ width: "auto" }}>
      <Button variant="primary" size="sm">
        {value}
      </Button>{" "}
    </div>
  );
};
