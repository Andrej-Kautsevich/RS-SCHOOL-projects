import {
  canvas,
  ctx,
  groundLevel,
  leftFactory,
  rightFactory,
  updateWagonState,
} from "./index.js";

import {
  getPathFromPipe,
} from "./calculations.js"

function drawNewOilRig(oilRigImg, mouseX) {
  ctx.drawImage(oilRigImg, mouseX - oilRigImg.width / 2, groundLevel - oilRigImg.height - 13);
}

function drawNewWagon(wagonImg, mouseX) {
  ctx.drawImage(wagonImg, 0, 0, 114, 55, mouseX - 114 / 2, groundLevel - wagonImg.height - 13 + 110, 114, 55);
}

function drawRadar(mouseX, mouseY, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.globalAlpha = 0.5;
  ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI)
  ctx.fill();
  ctx.restore();
}

function drawPipeLines(pipeLines) {
  pipeLines.forEach((pipe) => {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#7b8688"
    ctx.setLineDash([]);
    ctx.moveTo(pipe.startX, pipe.startY);
    ctx.lineTo(pipe.endX, pipe.endY);
    ctx.stroke();
    ctx.restore();
  })
}

function drawOilRigs(oilRigImg, oilRigs, capacity) {
  oilRigs.forEach((oilRig) => {
    const maxLineHeight = 86 //line height in pixels
    const oilVolume = oilRig.oilVolume;

    const lineHeight = oilVolume / capacity * maxLineHeight

    ctx.save();
    ctx.moveTo(oilRig.valve, groundLevel - 13 - 8);
    ctx.lineTo(oilRig.valve, groundLevel - 13 - 8 - lineHeight);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#221c15";
    ctx.stroke();
    ctx.restore();

    ctx.drawImage(oilRigImg, oilRig.valve - oilRigImg.width / 2, groundLevel - oilRigImg.height - 13);
  })
}

function drawValves(valveImg, valves) {
  valves.forEach((valve) => {
    ctx.drawImage(valveImg, valve.x - (valveImg.width / 2), valve.y - (valveImg.height / 2))
    ctx.stroke(valve.pathArc);
  })
}

function drawActivePipe(pipes, valves) {
  pipes.forEach((pipe) => {
    if (pipe.isActive) {
      ctx.save();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#272016";
      ctx.setLineDash([100, 2]);
      ctx.lineDashOffset = offset;
      ctx.stroke(getPathFromPipe(pipe, valves));
      ctx.restore();
    }
  })
}

let offset = 0;
function pumpingAnimation(pipes, valves) {
  offset++;
  if (offset > 400) {
    offset = 0;
  }
  drawActivePipe(pipes, valves);
  // setTimeout(() => pumpingAnimation(pipes, valves), 10000)
}

function drawOilPolygons(polygons) {
  polygons.forEach((polygon) => {

    const path = polygon.path;
    let fillLevel = polygon.oilVolume / polygon.maxOilVolume;
    if (fillLevel < 0) fillLevel = 0;

    //create liner gradient
    let minPointY = polygon.points.reduce((min, curr) => min < curr.y ? min : curr.y, polygon.points[0].y);
    let maxPointY = polygon.points.reduce((max, curr) => max > curr.y ? max : curr.y, polygon.points[0].y);
    let pointX = polygon.points[0].x;

    let gradient = ctx.createLinearGradient(pointX, maxPointY, pointX, minPointY);
    gradient.addColorStop(0, "rgba(33, 27, 21, 1)");
    gradient.addColorStop(fillLevel, "rgba(33, 27, 21, 1)")
    gradient.addColorStop(fillLevel, "rgba(33, 27, 21, 0)")
    gradient.addColorStop(1, "rgba(33, 27, 21, 0)")


    ctx.save();
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "#9a4c25";
    ctx.lineWidth = 5;
    ctx.fill(path);
    ctx.stroke(path);
    ctx.restore();
  })
}

function drawFrame(img, frameX, frameY, canvasX, canvasY, direction) {
  const width = 114; //frame width
  const height = 55; //frame height
  ctx.save();
  if (direction < 0) {
    ctx.scale(-1, 1);
    canvasX = -canvasX - width;
  }
  ctx.drawImage(img, frameX * width, frameY * height, width, height, canvasX, canvasY, width, height);
  ctx.restore();
}

//wagon animation
const MOVEMENT_SPEED = 0.5;
const WAGON_CYCLE_LOOP = [0, 1, 2, 3, 4, 5, 6];

function drawWagons(wagonImg, wagons) {
  if (wagons.length === 0) return;

  wagons.forEach((wagon) => {
    wagon.frameCount++;
    updateWagonState(wagon)

    if (wagon.isActive) {

      const direction = wagon.direction;

      wagon.canvasX += direction * MOVEMENT_SPEED;
      if (wagon.frameCount > 30) {
        wagon.frameX++;
        wagon.frameCount = 0;
      }
      if (wagon.frameX >= WAGON_CYCLE_LOOP.length) {
        wagon.frameX = 0;
      }
    }
    drawFrame(wagonImg, wagon.frameX, wagon.frameY, wagon.canvasX, wagon.canvasY, wagon.direction)
  })
}

function drawOilPrice() {
  ctx.save();
  ctx.font = "48px Smokum";
  ctx.fillText(`$${leftFactory.price.toFixed(2)}`, 40, groundLevel - 180);
  ctx.textAlign = "end";
  ctx.fillText(`$${rightFactory.price.toFixed(2)}`, canvas.width - 40, groundLevel - 180);
  ctx.restore();
}

export {
  drawPipeLines,
  drawNewOilRig,
  drawNewWagon,
  drawRadar,
  drawOilRigs,
  drawValves,
  drawOilPolygons,
  drawFrame,
  drawWagons,
  drawOilPrice,
  pumpingAnimation,
}