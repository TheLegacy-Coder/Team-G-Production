import React from "react";
import Button from "react-bootstrap/Button";

interface ResourceButtonProps {
  value: string;
}

function ResourceButton(props: ResourceButtonProps) {
  const { value } = props;

  return (
    <div style={{ width: "400px" }}>
      <Button variant="primary" size="sm">
        {value}
      </Button>{" "}
    </div>
  );
}

export default ResourceButton;
