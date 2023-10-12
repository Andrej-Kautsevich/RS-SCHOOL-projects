const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

import {
  getPathAlongLine,
  getPathFromPipe,
  checkLinesIntersect,
  createOilPolygons,
} from "./calculations.js"

// draw new pipe
let isDrawing = false;
let canCreate = true;
let pipeLines = [];
let oilRigs = [];
let valves = [];
let groundLevel;
let currentValve;
let pipes = [];
const polygons = [];         // Массив для хранения координат многоугольников

canvas.addEventListener("mousedown", (event) => {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;
  if (isOilRigDrawing) return;
  /*   if (!isOilRigDrawing && isMouseInValve(mouseX, mouseY)) {
      isDrawing = true;
    } */

  const valve = isMouseInValve(mouseX, mouseY);
  currentValve = valve;
  if (valve) {
    isDrawing = true;
  }
});

canvas.addEventListener("mousemove", (event) => {
  drawNewPipe(event);
  drawNewOilRig(event);
});
canvas.addEventListener("mouseup", (event) => {
  createNewPipeLine(event);
  createNewOilRig(event);
});

function isMouseInValve(mouseX, mouseY) {
  for (let i = 0; i < valves.length; i++) {
    if (ctx.isPointInPath(valves[i].pathArc, mouseX, mouseY)) {
      return valves[i];  // точка внутри path
    }
  }
  return false; // точка не внутри любого path
}

function drawNewPipe(event) {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  if (!isDrawing) return;
  if (isOilRigDrawing) return;

  ctx.save();
  ctx.setLineDash([]); // возвращает обратно к сплошной линии
  ctx.strokeStyle = "white"; // возвращаем начальный цвет
  canCreate = true;
  ctx.clearRect(0, groundLevel, canvas.width, canvas.height);

  updateState();

  if (mouseY < groundLevel) {
    ctx.setLineDash([5, 15]); // создает пунктирный паттерн: 5px образующей линии, 15px промежутка
    ctx.strokeStyle = "red";
    canCreate = false;
  } // can not create pipes above ground 

  pipeLines.forEach((pipe) => {
    // if new line intersect with old existing pipes
    if (checkLinesIntersect(pipe.startX, pipe.startY, pipe.endX, pipe.endY, currentValve.x, currentValve.y, mouseX, mouseY)) {
      ctx.setLineDash([5, 15]);
      ctx.strokeStyle = "red";
      canCreate = false;
    }
  })

  // draw new pipe
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.moveTo(currentValve.x, currentValve.y);
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
  ctx.restore();
}

function createNewPipeLine(event) {
  if (!isDrawing) return;
  if (isOilRigDrawing) return;

  const mouseX = event.offsetX;
  const mouseY = event.offsetY;
  isDrawing = false;

  if (!canCreate) {
    ctx.clearRect(0, groundLevel, canvas.width, canvas.height); //remove drawn line

    updateState();
  } else {
    ctx.closePath();
    pipeLines.push({
      startX: currentValve.x,
      startY: currentValve.y,
      endX: mouseX,
      endY: mouseY,
    })

    //create new valve on pipe end
    let pathArc = new Path2D();
    pathArc.arc(mouseX, mouseY, valveImg.width / 2, 0, 2 * Math.PI);

    let newPathToValve = currentValve.pathToValve.slice();

    newPathToValve.push(valves.length + 1);

    valves.push({
      id: valves.length + 1,
      pathToValve: newPathToValve,
      toOilRig: currentValve.toOilRig,
      pathArc: pathArc,
      x: mouseX,
      y: mouseY,
    });

    polygons.forEach((polygon) => {
      const path = polygon.path;
      if (ctx.isPointInPath(path, mouseX, mouseY)) {
        console.log(polygon.id)
        polygon.isActive = true;

        //add new active pipe
        pipes.push({
          endValveId: valves.length,
          isActive: true,
          path: newPathToValve,
          polygon: polygon.id,
        })
      }
    })
    updateState();
  }
}

function drawPipeLines() {
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

function drawNewOilRig(event) {
  if (!isOilRigDrawing) return;

  ctx.save();
  const mouseX = event.offsetX;
  ctx.clearRect(0, 0, canvas.width, groundLevel);
  ctx.restore();

  updateState();
  ctx.drawImage(oilRigImg, mouseX - oilRigImg.width / 2, groundLevel - oilRigImg.height - 13);
}

function createNewOilRig(event) {
  if (!isOilRigDrawing) return;

  const mouseX = event.offsetX;
  isOilRigDrawing = false;
  oilRigs.push({
    valve: mouseX,
    id: oilRigs.length + 1,
  });

  let pathArc = new Path2D();
  pathArc.arc(mouseX, groundLevel - valveImg.height / 2, valveImg.width / 2, 0, 2 * Math.PI)
  valves.push({
    id: valves.length + 1,
    pathToValve: [valves.length + 1],
    toOilRig: oilRigs.length,
    pathArc: pathArc,
    x: mouseX,
    y: groundLevel - valveImg.height / 2,
  })

  // pipes.push({
  //   id: pipes.length + 1,
  //   // pathToRig: pathToRig,
  //   isActive: false,
  //   toRigId: oilRigs.length,
  // })
  updateState();
}

function drawOilRigs() {
  oilRigs.forEach((oilRig) => {
    ctx.drawImage(oilRigImg, oilRig.valve - oilRigImg.width / 2, groundLevel - oilRigImg.height - 13);
    // ctx.drawImage(valveImg, oilRig.valve - (valveImg.width / 2), groundLevel - valveImg.height / 2 - 10);
  })
}

function drawValves() {
  valves.forEach((valve) => {
    ctx.drawImage(valveImg, valve.x - (valveImg.width / 2), valve.y - (valveImg.height / 2))
    ctx.stroke(valve.pathArc);
  })
}

function drawActivePipe() {
  pipes.forEach((pipe) => {
    if (pipe.isActive) {
      ctx.save();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#272016";
      ctx.stroke(getPathFromPipe(pipe, valves));
      ctx.restore();
    }
  })
}

// Рисование многоугольников
function drawOilPolygons(polygons) {
  polygons.forEach((polygon) => {

    const path = polygon.path;

    ctx.save();
    ctx.fillStyle = "#211b15";
    ctx.strokeStyle = "#9a4c25";
    ctx.lineWidth = 5;
    ctx.fill(path);
    ctx.stroke(path);
    ctx.restore();
  })
}

function drawBackground() {
  ctx.drawImage(background, 0, 0);
  ctx.translate(0, background.height)

  //road background
  ctx.beginPath();
  ctx.fillStyle = "#d68b53";
  ctx.fillRect(0, 0, canvas.width, 13)
  ctx.closePath();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawGroundBackground() {
  let clipPath = new Path2D();
  if (pipeLines.length) {
    for (let pipe of pipeLines) {
      clipPath.addPath(getPathAlongLine(pipe.startX, pipe.startY, pipe.endX, pipe.endY, 50));
    }
  }
  ctx.save(); // Сохранение текущего состояния
  ctx.clip(clipPath);
  //ground background
  ctx.beginPath();
  ctx.fillStyle = "#714031";
  ctx.fillRect(0, groundLevel, canvas.width, canvas.height - background.height)
  ctx.closePath();
  //oil polygons
  drawOilPolygons(polygons);
  ctx.restore(); // Восстановление состояния до clip()
}

function drawGroundOverlay() {
  ctx.drawImage(overlay, 0, groundLevel)
}

function updateState() {
  drawBackground();
  drawGroundOverlay();
  drawGroundBackground();
  drawPipeLines(); // draw existing pipes
  drawOilRigs(); //draw existing oil rigs
  drawActivePipe();
  drawValves();
}








//Images
const overlay = new Image();
const background = new Image();
const oilRigImg = new Image();
const valveImg = new Image();

//Source
overlay.src = "assets/soil.jpg";
background.src = "assets/background.jpg";
oilRigImg.src = "assets/oil-rig.png";
valveImg.src = "assets/valve.png";

function loadImg(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function initGame() {
  try {
    // Wait until images are loaded
    const background = await loadImg('assets/background.jpg');
    const overlay = await loadImg('assets/soil.jpg');
    const oilRigImg = await loadImg('assets/oil-rig.png');
    const valveImg = await loadImg('assets/valve.png');

    groundLevel = background.height + 13; // background + road
    drawBackground()
    drawGroundOverlay();
    createOilPolygons(groundLevel, polygons);
    drawGroundBackground();
  }
  catch (err) {
    console.error(err);
  }
}

initGame();


const menu = document.querySelector('.top-menu');

const oilRigIcon = document.getElementById('oil-rig');

let isOilRigDrawing = false;

oilRigIcon.addEventListener('click', () => {
  isOilRigDrawing = true;
})