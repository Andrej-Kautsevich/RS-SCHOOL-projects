const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

import {
  getPathAlongLine,
  getPathFromPipe,
  checkLinesIntersect,
  createOilPolygons,
} from "./calculations.js"

let isPipeDrawing = false;
let canCreatePipe = false;
let pipeLines = [];
let oilRigs = [];
let wagons = [];
let valves = [];
let groundLevel;
let currentValve;
let pipes = [];
const OIL_RIG_CAPACITY = 1000; //max oil in rig
const WAGON_CAPACITY = 500; // max oil in wagon
const OIL_PUMP_SPEED = 10; // Oil volume decrease per 0.1 second
const WAGON_WIDTH = 114;
const polygons = [];         // Массив для хранения координат многоугольников

const MOVEMENT_SPEED = 0.5;
const WAGON_CYCLE_LOOP = [0, 1, 2, 3, 4, 5, 6];


function isMouseInValve(mouseX, mouseY) {
  for (let i = 0; i < valves.length; i++) {
    if (ctx.isPointInPath(valves[i].pathArc, mouseX, mouseY)) {
      return valves[i];  // точка внутри path
    }
  }
  return false; // точка не внутри любого path
}

function drawNewPipe(startX, startY, mouseX, mouseY) {
  ctx.save();
  ctx.strokeStyle = "white"; // возвращаем начальный цвет */

  canCreatePipe = true;
  if (mouseY < groundLevel) {
    ctx.setLineDash([5, 15]); // создает пунктирный паттерн: 5px образующей линии, 15px промежутка
    ctx.strokeStyle = "red";
    canCreatePipe = false;   // can not create pipes above ground 
  }

  pipeLines.forEach((pipe) => {
    // if new line intersect with old existing pipes
    if (checkLinesIntersect(pipe.startX, pipe.startY, pipe.endX, pipe.endY, currentValve.x, currentValve.y, mouseX, mouseY)) {
      ctx.setLineDash([5, 15]);
      ctx.strokeStyle = "red";
      canCreatePipe = false;
    }
  })

  // draw new pipe
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.moveTo(startX, startY);
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
  ctx.restore();
}

function createNewPipeLine(event) {
  if (isWagonDrawing) return;
  if (isOilRigDrawing) return;
  if (!canCreatePipe) {
    isPipeDrawing = false;
    return
  };

  const mouseX = event.offsetX;
  const mouseY = event.offsetY;
  isPipeDrawing = false;

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
      const toNewOilRig = currentValve.toOilRig;

      if (!polygon.toOilRig.includes(toNewOilRig)) {
        let toOilRig = polygon.toOilRig.slice();
        toOilRig.push(toNewOilRig);
        polygon.toOilRig = toOilRig;
      }

      console.log(polygon.id, toNewOilRig);

      //add new active pipe
      pipes.push({
        isActive: false,
        path: newPathToValve,
        polygonID: polygon.id,
        toOilRig: currentValve.toOilRig,
      })
    }
  })
  canCreatePipe = false;
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

function drawNewOilRig(mouseX) {
  ctx.drawImage(oilRigImg, mouseX - oilRigImg.width / 2, groundLevel - oilRigImg.height - 13);
}

function createNewOilRig(event) {
  if (!isOilRigDrawing) return;

  const mouseX = event.offsetX;
  isOilRigDrawing = false;
  oilRigs.push({
    valve: mouseX,
    id: oilRigs.length + 1,
    oilVolume: 0,
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
}

function drawNewWagon(mouseX) {
  ctx.drawImage(wagonImg, 0, 0, 114, 55, mouseX - 114 / 2, groundLevel - wagonImg.height - 13, 114, 55);
}

function createNewWagon(event) {
  if (!isWagonDrawing) return;

  const mouseX = event.offsetX;
  isWagonDrawing = false;
  wagons.push({
    id: wagons.length + 1,
    isActive: true,
    oilVolume: 0,
    frameX: 0,
    frameY: 0,
    canvasX: mouseX - 114 / 2,
    canvasY: groundLevel - wagonImg.height - 13,
    direction: 1, //right
  });

  drawWagonFrame(0, 0, mouseX - 114 / 2, groundLevel - wagonImg.height - 13, 1);
}

function drawOilRigs() {
  oilRigs.forEach((oilRig) => {
    const maxLineHeight = 86 //line height in pixels
    const oilVolume = oilRig.oilVolume;

    const lineHeight = oilVolume / OIL_RIG_CAPACITY * maxLineHeight

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
    const fillLevel = polygon.oilVolume / polygon.maxOilVolume;

    ctx.save();
    ctx.fillStyle = `rgba(33, 27, 21, ${fillLevel})`;
    ctx.strokeStyle = "#9a4c25";
    ctx.lineWidth = 5;
    ctx.fill(path);
    ctx.stroke(path);
    ctx.restore();
  })
}

function drawBackground() {
  ctx.drawImage(background, 0, 0);
  ctx.drawImage(rightInc, canvas.width - rightInc.width, groundLevel - rightInc.width - 11);
  ctx.drawImage(leftInc, 0, groundLevel - leftInc.width - 11);

  ctx.translate(0, background.height)

  //road background
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#d68b53";
  ctx.fillRect(0, 0, canvas.width, 13)
  ctx.closePath();
  ctx.restore();

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

function drawWagonFrame(frameX, frameY, canvasX, canvasY, direction) {
  const width = 114; //frame width
  const height = 55; //frame height
  ctx.save();
  if (direction < 0) {
    ctx.scale(-1, 1);
    canvasX = -canvasX - width;
  }
  ctx.drawImage(wagonImg, frameX * width, frameY * height, width, height, canvasX, canvasY, width, height);
  ctx.restore();
}

let frameCount = 0;
function drawWagons() {
  if (wagons.length === 0) return;

  frameCount++;
  wagons.forEach((wagon) => {
    updateWagonOil(wagon);
    if (wagon.isActive) {

      if (wagon.canvasX < 0 || wagon.canvasX + WAGON_WIDTH > canvas.width) {
        wagon.direction *= -1;
      }

      const direction = wagon.direction;

      wagon.canvasX += direction * MOVEMENT_SPEED;
      if (frameCount > 60) {
        wagon.frameX++;
        frameCount = 0;
      }
      if (wagon.frameX >= WAGON_CYCLE_LOOP.length) {
        wagon.frameX = 0;
      }
    }
    drawWagonFrame(wagon.frameX, wagon.frameY, wagon.canvasX, wagon.canvasY, wagon.direction)
  })
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawGroundOverlay();
  drawGroundBackground();
  drawOilRigs(); //draw existing oil rigs
  drawPipeLines(); // draw existing pipes
  drawActivePipe();

  drawWagons();

  if (isOilRigDrawing) {
    drawNewOilRig(toDraw.mouseX);
  }

  if (isWagonDrawing) {
    drawNewWagon(toDraw.mouseX);
  }

  if (isPipeDrawing) {
    drawNewPipe(toDraw.startX, toDraw.startY, toDraw.mouseX, toDraw.mouseY);
  }

  drawValves();
  window.requestAnimationFrame(render)
}

function updateOilRigs() {
  oilRigs.forEach((oilRig) => {
    updateOilRig(oilRig);
  })
}

function updateOilRig(oilRig) {
  pipes.forEach((pipe) => {
    if (pipe.toOilRig === oilRig.id) {
      const polygon = polygons.find(p => p.id === pipe.polygonID);
      updatePipe(pipe, oilRig, polygon);
    }
  })
}

function updatePipe(pipe, oilRig, polygon) {
  if (oilRig.oilVolume < OIL_RIG_CAPACITY && polygon.oilVolume > 0) {
    pipe.isActive = true;
    oilRig.oilVolume += OIL_PUMP_SPEED;
    polygon.oilVolume -= OIL_PUMP_SPEED;
  } else {
    pipe.isActive = false;
  }
}

function updateState() {
  updateOilRigs()
}

setInterval(updateState, 100);


function updateWagonOil(wagon) {
  // wagons.forEach((wagon) => {
  const position = wagon.canvasX + WAGON_WIDTH / 2;
  oilRigs.forEach((oilRig) => {
    if (oilRig.valve === position && oilRig.oilVolume > 0 && wagon.oilVolume < WAGON_CAPACITY) {
      wagon.isActive = false;
      wagon.oilVolume += OIL_PUMP_SPEED / 10;
      oilRig.oilVolume -= OIL_PUMP_SPEED / 10 ;
      if (wagon.oilVolume >= WAGON_CAPACITY) {
        wagon.isActive = true;
      }
    }
  })
  // })
}














let toDraw = {};

canvas.addEventListener("mousedown", mouseDownListener);
function mouseDownListener(event) {
  const startX = event.offsetX;
  const startY = event.offsetY;
  const valve = isMouseInValve(startX, startY);
  currentValve = valve;
  if (valve) {
    isPipeDrawing = true;
    toDraw.startX = currentValve.x; //adjust to valve center
    toDraw.startY = currentValve.y;
  }
}

canvas.addEventListener("mousemove", mouseMoveListener)
function mouseMoveListener(event) {
  toDraw.mouseX = event.offsetX;
  toDraw.mouseY = event.offsetY;
}

canvas.addEventListener("mouseup", (event) => {
  createNewPipeLine(event);
  createNewOilRig(event);
  createNewWagon(event);
});







//Images
const overlay = new Image();
const background = new Image();
const oilRigImg = new Image();
const valveImg = new Image();
const rightInc = new Image();
const leftInc = new Image();
const wagonImg = new Image();


//Source
overlay.src = "assets/soil.jpg";
background.src = "assets/background.jpg";
oilRigImg.src = "assets/oil-rig.png";
valveImg.src = "assets/valve.png";
rightInc.src = "assets/right.png";
leftInc.src = "assets/left.png";
wagonImg.src = "assets/Wagon114x55.png";


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
    const rightInc = await loadImg('assets/right.png');
    const leftInc = await loadImg('assets/left.png');
    const wagonImg = await loadImg('assets/Wagon114x55.png');

    groundLevel = background.height + 13; // background + road
    drawBackground()
    drawGroundOverlay();
    createOilPolygons(groundLevel, polygons);
    drawGroundBackground();
    window.requestAnimationFrame(render)
  }
  catch (err) {
    console.error(err);
  }
}

initGame();


const menu = document.querySelector('.top-menu');

const oilRigIcon = document.getElementById('oil-rig');
const wagonIcon = document.getElementById('wagon');

let isOilRigDrawing = false;
let isWagonDrawing = false;

oilRigIcon.addEventListener('click', () => {
  isOilRigDrawing = true;
})
wagonIcon.addEventListener('click', () => {
  isWagonDrawing = true;
})

alert ('Привет, это не законченная работа, если есть возможность отложить проверку, свяжись со мной в дискорд, я напишу как закончу, спасибо!')