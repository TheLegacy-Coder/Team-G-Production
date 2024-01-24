import React from "react";

const image = new Image();
image.src = "chashu.jpg";

export const PageNotFound = () => {
  return (
    <div className={"page-frame"}>
      <div>Error 404: Page Not Found</div>
      <div>
        This isn't supposed to happen... But don't worry. Take a look at this
        awesome picture.{" "}
      </div>
      <img src="chashu.jpg" alt="us having fun :)" width="680" height="512" />
      <p>look at him go!!!</p>
      <img src="duck.gif" alt="duck dancing" width="200" height="200" />
    </div>
  );
};
