const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// import {
//   getPathAlongLine,
//   getPathFromPipe,
//   checkLinesIntersect,
//   createOilPolygons,
// } from "./calculations.js"

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

        drawWagonFrame(wagon.frameX, wagon.frameY, wagon.canvasX, wagon.canvasY, wagon.direction)

    }
  })
}


let positionX = 0; //wagon
let positionY = 0;

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




function getPathAlongLine(startX, startY, endX, endY, lineWidth) {
  // Вычисление вектора направления
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const directionX = dx / length;
  const directionY = dy / length;

  // Добавить 10px к концу линии
  const extension = 25;
  endX += directionX * extension;
  endY += directionY * extension;

  // Вычисление перпендикулярного вектора
  const perpendicularX = -directionY;
  const perpendicularY = directionX;

  // Вычисление точек пути
  const startPointLeft = {
    x: startX + perpendicularX * lineWidth / 2,
    y: startY + perpendicularY * lineWidth / 2
  };
  const endPointLeft = {
    x: endX + perpendicularX * lineWidth / 2,
    y: endY + perpendicularY * lineWidth / 2
  };
  const endPointRight = {
    x: endX - perpendicularX * lineWidth / 2,
    y: endY - perpendicularY * lineWidth / 2
  };
  const startPointRight = {
    x: startX - perpendicularX * lineWidth / 2,
    y: startY - perpendicularY * lineWidth / 2
  };

  let path = new Path2D();

  path.moveTo(startPointLeft.x, startPointLeft.y);
  path.lineTo(endPointLeft.x, endPointLeft.y);
  path.lineTo(endPointRight.x, endPointRight.y);
  path.lineTo(startPointRight.x, startPointRight.y);
  path.closePath();

  return path;
}

const polygonSize = 100;    // Max polygon size

function createOilPolygons(groundLevel, polygons) {
  const canvasWidth = 1024;    // Ширина холста
  const canvasHeight = 400;    // Высота холста
  const numPolygons = 4;       // Количество многоугольников
  const polygonGap = Math.floor((canvasWidth - polygonSize * 2) / numPolygons);

  let originX = polygonSize;
  while (originX < (canvasWidth - polygonSize)) {
    const originY = groundLevel + polygonSize + Math.floor(Math.random() * (canvasHeight - polygonSize));
    const polygonSideNumber = Math.floor(Math.random() * 6 + 5) //random number between [5-10]
    const points = generatePolygon(polygonSideNumber, originX, originY);
    const oilVolume = calculatePolygonArea(points);
    let path = new Path2D();

    path.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i].x, points[i].y)
    }

    path.closePath();

    polygons.push({
      id: polygons.length + 1,
      path: path,
      points: points,
      oilVolume: oilVolume,
      maxOilVolume: oilVolume,
      isActive: false,
      activePipesId: [],
      toOilRig: [],
    });
    originX += polygonSize + Math.floor(Math.random() * polygonGap);
  }
}

//calculate oil volume in polygon
function calculatePolygonArea(polygon) {
  let area = 0;
  const numVertices = polygon.length;

  for (let i = 0; i < numVertices; i++) {
    const currentVertex = polygon[i];
    const nextVertex = polygon[(i + 1) % numVertices];

    area += (currentVertex.x * nextVertex.y) - (currentVertex.y * nextVertex.x);
  }

  return Math.abs(area / 2);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let t = array[i]; array[i] = array[j]; array[j] = t
  }
}

//based on this work https://cglab.ca/~sander/misc/ConvexGeneration/convex.html
function generatePolygon(n = 10, originX = 0, originY = 0) {
  // Step 1: generate two list of random X and Y coordinates
  const xPool = [];
  const yPool = [];
  for (let i = 0; i < n; i++) {
    xPool.push(Math.floor(Math.random() * polygonSize))
    yPool.push(Math.floor(Math.random() * polygonSize))
  }

  // Step 2: sort them (here by x coordinate for starting point in Graham scan algorithm)
  const sortedPointsX = xPool.sort((a, b) => a - b);
  const sortedPointsY = yPool.sort((a, b) => a - b);

  // Step 3: isolate the extreme points
  const minX = sortedPointsX[0];
  const maxX = sortedPointsX.at(-1);
  const minY = sortedPointsY[0];
  const maxY = sortedPointsY.at(-1);

  // Step 4-5: Divide the interior points into two chains & Extract the vector components
  let xVec = [], yVec = [];

  let lastTop = minX, lastBot = minX;

  for (let i = 1; i < n - 1; i++) {
    let x = xPool[i];

    if (Math.random() < 0.5) {
      xVec.push(x - lastTop);
      lastTop = x;
    } else {
      xVec.push(lastBot - x);
      lastBot = x;
    }
  }

  xVec.push(maxX - lastTop);
  xVec.push(lastBot - maxX);

  let lastLeft = minY, lastRight = minY;

  for (let i = 1; i < n - 1; i++) {
    let y = yPool[i];

    if (Math.random() < 0.5) {
      yVec.push(y - lastLeft);
      lastLeft = y;
    } else {
      yVec.push(lastRight - y);
      lastRight = y;
    }
  }

  yVec.push(maxY - lastLeft);
  yVec.push(lastRight - maxY);

  // Steps 6: Randomly pair up the X- and Y-components
  shuffle(yVec);

  //Steps 7: Combine the paired up components into vectors
  let vec = [];

  for (let i = 0; i < n; i++) {
    vec.push({ x: xVec[i], y: yVec[i] });
  }

  //Steps 8: Sort the vectors by angle
  vec.sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));

  // Step 9: Lay them end-to-end to form a polygon
  let x = 0, y = 0;
  let minPolygonX = 0;
  let minPolygonY = 0;
  let points = [];

  for (let i = 0; i < n; i++) {
    points.push({ x: x, y: y });

    x += vec[i].x;
    y += vec[i].y;

    minPolygonX = Math.min(minPolygonX, x);
    minPolygonY = Math.min(minPolygonY, y);
  }

  // Step 10: Move the polygon
  let offsetX = originX - minPolygonX;
  for (let i = 0; i < n; i++) {
    let p = points[i];
    points[i] = { x: p.x + offsetX, y: p.y + originY };
  }

  return points
}

function getPathFromPipe(pipe, valves) {
  let pathToRig = new Path2D();

  let valvesId = pipe.path
  let points = [];

  for (let id of valvesId) {
    for (let i = 0; i < valves.length; i++) {
      if (valves[i].id === id) {
        points.push({ x: valves[i].x, y: valves[i].y });
        break;
      }
    }
  }

  pathToRig.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    pathToRig.lineTo(points[i].x, points[i].y)
  }
  return pathToRig;
}

// check intersect with existing pipe
//x1, y1, line1 start
//x2, y2 line1 end
//x3, y3 line2 start
//x4, y4 line2 end
function checkLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  if (x1 === x3 && y1 === y3) {
    return false;
  }

  if (x2 === x3 && y2 === y3) {
    return false;
  }

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  return true;
}

// export {
//   getPathAlongLine,
//   getPathFromPipe,
//   checkLinesIntersect,
//   createOilPolygons,
// }