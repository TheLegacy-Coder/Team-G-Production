import React from "react";

const CloseProgram = () => {
  const handleClose = () => {
    // Attempt to close the window
    window.close();
  };

  return <button onClick={handleClose}>Close Program</button>;
};

export default CloseProgram;
