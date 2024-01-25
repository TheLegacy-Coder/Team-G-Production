import React from "react";

const image = new Image();
image.src = "Snapchat-449567957.jpg";

export const PageNotFound = () => {
  return (
    <div className={"page-frame"}>
      <div>
        <br />
        <div>Error 404: Page Not Found</div>
      </div>
      <br />
      <div>
        This isn't supposed to happen... But don't worry. Take a look at this
        awesome picture.{" "}
      </div>
      <img
        src="Snapchat-449567957.jpg"
        alt="us having fun :)"
        width="680"
        height="512"
      />
      <br />
      <br />
      <p>Look at him go!!!</p>
      <img src="duck.gif" alt="duck dancing" width="200" height="200" />
    </div>
  );
};
