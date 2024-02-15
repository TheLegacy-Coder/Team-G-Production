import {
  ctx,
  image,
  offset,
  resetPath,
  scalar,
  searchAlg,
  setImage,
  setRedraw,
  setScalar,
} from "./Draw.ts";
import { updateCoords, upleftCorner, downrightCorner } from "./Mouse.ts";

let newMap = true;
export let currentFloor = "L1";

// resets map position to a default position
export function homePosition() {
  if (ctx === null) {
    return;
  }
  ctx!.translate(-1200, -400);
  updateCoords();
  //scalar = 0.75;
  setScalar(0.75);
  ctx!.scale(0.75, 0.75);
  updateCoords();
  boundCoords();
  const scaleID = document.querySelector("#scalar");
  scaleID!.textContent = scalar.toFixed(2).toString();
}

export function resetMap() {
  //frames = [[[]]];
  resetPath();
  //drawStep = 0;
  ctx!.scale(1 / scalar, 1 / scalar);
  //scalar *= 1 / scalar;
  setScalar(1);
  updateCoords();
  ctx!.translate(upleftCorner!.x, upleftCorner!.y);
  updateCoords();
  //redraw = true;
  setRedraw();
}

export function setMap(floor: string, imageSrc: string) {
  if (newMap) {
    newMap = false;
    const tempScalar = scalar;
    ctx!.save();
    resetMap();
    currentFloor = floor;
    //image = new Image();
    //image.src = imageSrc;
    setImage(imageSrc);
    homePosition();
    newMap = true;
    ctx!.restore();
    //scalar = tempScalar;
    setScalar(tempScalar);
    const scaleID = document.querySelector("#scalar");
    scaleID!.textContent = scalar.toFixed(2).toString();
    //path = [];
    //frames = [[[]]];
    resetPath();
    //aStar();
    searchAlg();
  }
  setTimeout(() => {
    //redraw = true;
    setRedraw();
  }, 100);
}

export function boundCoords() {
  if (downrightCorner === undefined || upleftCorner === undefined) return null;
  if (downrightCorner.x - upleftCorner.x > image.width) {
    // centers canvas along x axis
    ctx!.translate(upleftCorner.x, 0);
    updateCoords();
    ctx!.translate(
      (downrightCorner.x - image.width - offset.x / scalar) / 2,
      0,
    );
  } else {
    if (upleftCorner.x < 0) {
      // aligns canvas along left side
      ctx!.translate(upleftCorner.x, 0);
    } else if (downrightCorner.x > image.width + offset.x / scalar) {
      // aligns canvas along right side
      ctx!.translate(-image.width - offset.x / scalar + downrightCorner.x, 0);
    }
  }
  if (downrightCorner.y - upleftCorner.y > image.height) {
    // centers canvas along y axis
    ctx!.translate(0, upleftCorner.y);
    updateCoords();
    ctx!.translate(
      0,
      (downrightCorner.y - image.height - offset.y / scalar) / 2,
    );
  } else {
    if (upleftCorner.y < 0) {
      // aligns canvas along top side
      ctx!.translate(0, upleftCorner.y);
    } else if (downrightCorner.y > image.height + offset.y / scalar) {
      // aligns canvas along bottom side
      ctx!.translate(0, -image.height - offset.y / scalar + downrightCorner.y);
    }
  }
  updateCoords();
}
